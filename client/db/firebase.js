import {initializeApp} from 'firebase/app'
// import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyChMCs0vC1InLHKdJsQy4xGfK-gzZAtzPA",
  authDomain: "parkit-ebd49.firebaseapp.com",
  projectId: "parkit-ebd49",
  storageBucket: "parkit-ebd49.appspot.com",
  messagingSenderId: "310877737236",
  appId: "1:310877737236:web:3ebbac1cdf5e0103287201",
  measurementId: "G-VQ3JHNH0QD"
};

const app = initializeApp(firebaseConfig);
export const firestore_DB = getFirestore(app);
// export const firebase_Auth=getAuth(firebase_App);