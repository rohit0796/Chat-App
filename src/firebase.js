 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCvwDobvv5iPqm-n9vlzvTAixZ7rv1IpCU",
  authDomain: "chart-app-90459.firebaseapp.com",
  projectId: "chart-app-90459",
  storageBucket: "chart-app-90459.appspot.com",
  messagingSenderId: "381099527558",
  appId: "1:381099527558:web:a5663ed3988142b784f007",
  measurementId: "G-PSR2MM4TMD"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage();
