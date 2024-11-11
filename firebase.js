// Import the Firebase functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALX9Lvuyw17snJDw_ibmmLsyAh13qr31o",
  authDomain: "nbastatsapp-d0201.firebaseapp.com",
  projectId: "nbastatsapp-d0201",
  storageBucket: "nbastatsapp-d0201.appspot.com",
  messagingSenderId: "400856559241",
  appId: "1:400856559241:web:c21de08b76d16225e02058",
  measurementId: "G-WFGZ2XGL67" // This can be kept, though unused here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
