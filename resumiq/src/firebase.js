// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvSjtZUiUug8Bde9duUG3vXahghzYjHMI",
  authDomain: "resumiq-6b928.firebaseapp.com",
  projectId: "resumiq-6b928",
  storageBucket: "resumiq-6b928.firebasestorage.app",
  messagingSenderId: "87304273740",
  appId: "1:87304273740:web:b1e5a04c4c140bdc7a59e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

// ✅ ADD THIS FOR GOOGLE LOGIN
export const googleProvider = new GoogleAuthProvider();
