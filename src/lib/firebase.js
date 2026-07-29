import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_MGe_RHikrT1lLzm7FlsoA_kDi7Lv7NE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kanha--door-house.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kanha--door-house",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kanha--door-house.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "616848835194",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:616848835194:web:9218cc80a65669f559f1c3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-S3N7PGR9LD"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
