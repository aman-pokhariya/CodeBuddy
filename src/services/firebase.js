import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForDevelopment",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "codebuddy-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "codebuddy-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "codebuddy-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
