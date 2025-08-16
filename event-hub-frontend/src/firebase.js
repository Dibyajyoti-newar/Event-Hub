// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Make sure you import getAuth
import { getFirestore } from "firebase/firestore"; 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe7z7MCqGspKRl4_e8S2n_e3JbOtCHquw",
  authDomain: "events-hub-2d47d.firebaseapp.com",
  projectId: "events-hub-2d47d",
  storageBucket: "events-hub-2d47d.appspot.com",
  messagingSenderId: "27721255019",
  appId: "1:27721255019:web:ed6c04b488bdda945a492e",
  measurementId: "G-917YHGSFGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export const db = getFirestore(app);
