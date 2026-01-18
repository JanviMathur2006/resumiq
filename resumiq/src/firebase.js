// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/* =====================================================
   FIREBASE CONFIG
===================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyDvSjtZUiUug8Bde9duUG3vXahghzYjHMI",
  authDomain: "resumiq-6b928.firebaseapp.com",
  projectId: "resumiq-6b928",
  storageBucket: "resumiq-6b928.firebasestorage.app",
  messagingSenderId: "87304273740",
  appId: "1:87304273740:web:b1e5a04c4c140bdc7a59e9",
};

/* =====================================================
   INITIALIZE FIREBASE
===================================================== */
const app = initializeApp(firebaseConfig);

/* =====================================================
   AUTH
===================================================== */
export const auth = getAuth(app);

/* =====================================================
   GOOGLE AUTH PROVIDER
===================================================== */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
