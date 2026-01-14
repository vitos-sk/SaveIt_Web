import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAfl5w8ymuB7pfOCMPtwVgZmPVl6luRgUQ",
  authDomain: "save-it-93b43.firebaseapp.com",
  databaseURL: "https://save-it-93b43-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "save-it-93b43",
  storageBucket: "save-it-93b43.firebasestorage.app",
  messagingSenderId: "214337158552",
  appId: "1:214337158552:web:894e1fdc16d68b7b6dbfed",
  measurementId: "G-8VYH3Y40M1",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
