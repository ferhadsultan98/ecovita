// src/server/server.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove, update } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3iCDoGXoamiNg5rUrGU5uqmnfMHKO9BI",
  authDomain: "gubagarden.firebaseapp.com",
  projectId: "gubagarden",
  storageBucket: "gubagarden.firebasestorage.app",
  messagingSenderId: "920416051355",
  appId: "1:920416051355:web:6acffca1bb687b0d4ca63e",
  measurementId: "G-L77LRCTPG3",
  databaseURL: "https://gubagarden-default-rtdb.firebaseio.com" 
};


const app = initializeApp(firebaseConfig);
let analytics = null;


if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Analytics failed to initialize:", error);
  }
}

const database = getDatabase(app);

export { database, analytics, ref, onValue, set, push, remove, update };