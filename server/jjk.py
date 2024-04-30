import cv2
import pytesseract
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import firestore
from datetime import datetime, timezone
import time
import re

# Initialize Firebase Admin SDK with service account credentials
cred = credentials.Certificate("dbcreds.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://parkit-ebd49-default-rtdb.firebaseio.com/'
})

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Get a Firestore client
firestore_db = firestore.client()

last_three_plates = []
entry_time = 0
exit_time = 0


def is_between(entry_time, exit_time):
    current_time = datetime.now(timezone.utc)
    return entry_time <= current_time <= exit_time


def get_user_bookings(plate_number):
    plate_number=plate_number.lower()
    # Reference to the user_bookings collection
    user_bookings_ref = firestore_db.collection('user_bookings')

    # Query user bookings where plate_no matches the detected plate number
    query = user_bookings_ref.where(field_path='plate_no', op_string='==', value=plate_number)

    # Execute the query
    results = query.stream()

    # List to store the matching bookings
    matching_bookings = []

    # Iterate over the query results
    for doc in results:
        # Get the data from the document
        data = doc.to_dict()

        # Convert entry_time and exit_time to datetime objects
        entry_time = data['entry_time']
        exit_time = data['exit_time']

        # Add the booking details to the list
        matching_bookings.append({
            'entry_time': entry_time,
            'exit_time': exit_time,
        })
        
        
    if len(matching_bookings)==0:
        print("No booking available for",plate_number.upper())
        time.sleep(3)

        
    matching_bookings=sorted(matching_bookings, key=lambda x:x['entry_time'])

    return matching_bookings


# Function to recognize number plates in real-time
def recognize_plate():
    # Initialize the video capture from the laptop camera
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open camera")
        return None

    # Load the pre-trained Haar cascade classifier for plate detection
    plate_cascade = cv2.CascadeClassifier("plate_recog.xml")

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()

        if not ret:
            print("Error: Unable to capture frame from the camera.")
            break
        
         # Resize frame to a smaller resolution
        frame = cv2.resize(frame, (640, 480))

        # Draw a frame for the user to place the license plate
        cv2.rectangle(frame, (100, 100), (540, 360), (0, 255, 0), 2)

        # Convert the frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Denoise using Gaussian blur
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Detect plates in the grayscale image
        plates = plate_cascade.detectMultiScale(blurred, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Reset the flag to False for each loop iteration
        gate_open = False

        # Draw bounding boxes around the detected plates and recognize plate numbers
        for (x, y, w, h) in plates:
            # if 100 < x < 440 and 100 < y < 380:  # Check if the license plate is placed inside the frame
            roi = frame[y:y + h, x:x + w]  # Region of interest containing potential license plate
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Draw rectangle around the region

            # Preprocess the ROI for OCR
            roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

            # Perform OCR using Tesseract on the region of interest
            plate_text = pytesseract.image_to_string(roi_gray, config='--psm 7')

            # Display the captured characters on the frame
            cv2.putText(frame, f"Plate Text: {plate_text}", (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

            # Check if the recognized text matches the expected format for Indian license plates
            plate_number = clean_text(plate_text)
            if re.match(r'^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$', plate_number):
                print("License Plate Number:", plate_number)

            # Print the scanned plate number
            print("Plate number:", plate_number)

            # Add the detected plate number to the list
            if plate_number:
                last_three_plates.append(plate_number)

            # Keep only the last three detected plates
            if len(last_three_plates) > 2:
                last_three_plates.pop(0)

            # Check if the last three detected plates are the same
            if len(last_three_plates) == 2 and len(set(last_three_plates)) == 1 and last_three_plates[0]:
                last_three_plates.clear()
                bookings = get_user_bookings(plate_number)

                for booking in bookings:
                    # Check if the current date and time lies between entry and exit time
                    if is_between(booking['entry_time'], booking['exit_time']):
                        print("Gate opened!")
                        last_three_plates.clear()
                        # wait some time before detecting again
                        time.sleep(3)
                        # Exit the loop since the gate is already open for this frame
                        gate_open = True
                        break
                    elif booking['entry_time']>datetime.now(timezone.utc):
                        print("Booking is available, but you are early. Your booking starts at:", booking['entry_time'].strftime('%Y-%m-%d %H:%M:%S'))
                        time.sleep(3)
                        break
                        
            # Draw the bounding box and plate number on the original frame
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(frame, plate_number, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # Update the Realtime Database if the last three detected plates are the same
        if gate_open:
            db.reference('/').update({'gate': True})

        # Display the frame with detected plates
        # cv2.imshow('License Plate Recognition', frame)

        # Break the loop if 'q' is pressed
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    # Release the camera and close OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

def clean_text(text):
    # Perform post-processing operations to clean and format the text
    # Example: Removing special characters, correcting errors, etc.
    
    # Strip leading and trailing whitespace
    cleaned_text = text.strip()
    
    # Remove non-alphanumeric characters
    cleaned_text = re.sub(r'[^a-zA-Z0-9]', '', cleaned_text)
    
    # Convert to uppercase (assuming license plate characters are typically uppercase)
    cleaned_text = cleaned_text.upper()
    
    # Keep only the first 10 characters
    cleaned_text = cleaned_text[:10]
    
    return cleaned_text

# Call the recognize_plate function to start the real-time recognition process
recognize_plate()
