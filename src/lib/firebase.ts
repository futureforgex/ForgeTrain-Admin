// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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