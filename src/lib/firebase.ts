// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCopHhxolOcf2s-AbRFoVuBj2JJ_rvSsE4",
  authDomain: "forgetrain-e32fe.firebaseapp.com",
  projectId: "forgetrain-e32fe",
  storageBucket: "forgetrain-e32fe.firebasestorage.app",
  messagingSenderId: "677978301218",
  appId: "1:677978301218:web:d44818dd7083535c3b7b7b",
  measurementId: "G-W37ME9SS7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Configure storage for development
if (import.meta.env.DEV) {
  // In development, we might want to use the emulator
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export const auth = getAuth(app);