// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { NextOrObserver, User, getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb2BYbPiTAU3coa-e3mcj07kEB8nZoPFo",
  authDomain: "blog-app-79625.firebaseapp.com",
  projectId: "blog-app-79625",
  storageBucket: "blog-app-79625.firebasestorage.app",
  messagingSenderId: "38943788770",
  appId: "1:38943788770:web:44c1d786644d74dfcb58bb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set up Auth State Listener to detect if the user is signed in
export const onAuthStateChangedListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};
