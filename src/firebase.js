import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB97rnctcP7cqNZy1qWcRpX3i7ak99Fjtk",
  authDomain: "timetabled-app-4b8c9.firebaseapp.com",
  projectId: "timetabled-app-4b8c9",
  storageBucket: "timetabled-app-4b8c9.appspot.com",
  messagingSenderId: "716611307752",
  appId: "1:716611307752:web:e191b0d9709ac7b4dbe15d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);