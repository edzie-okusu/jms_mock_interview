// Import the functions you need from the SDKs you need
import { initializeApp, getApp,getApps } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyBR2I7AAnDzCXQlVBpF_Lz5lI1_tpkP0Rs",
  authDomain: "prepwise-5af63.firebaseapp.com",
  projectId: "prepwise-5af63",
  storageBucket: "prepwise-5af63.firebasestorage.app",
  messagingSenderId: "930317630665", 
  appId: "1:930317630665:web:0ecaccf65f61282513a118",
  measurementId: "G-20E5CNLQ5W"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app)
