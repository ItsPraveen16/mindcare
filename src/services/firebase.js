import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQE_8enQ2VV4CS2psawhJ5kT5irwUWJZg",
  authDomain: "mindcare-41386.firebaseapp.com",
  projectId: "mindcare-41386",
  storageBucket: "mindcare-41386.firebasestorage.app",
  messagingSenderId: "467505152371",
  appId: "1:467505152371:web:4452cc1d418c8125550506",
  measurementId: "G-M095HMJ2C0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);