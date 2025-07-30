// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";


/*
const firebaseConfig = {
  apiKey: "AIzaSyBzVCOxfopRi1b2lQWSv30P-0z7maUkxP8",
  authDomain: "iwfgaleri.firebaseapp.com",
  projectId: "iwfgaleri",
  storageBucket: "iwfgaleri.firebasestorage.app",
  messagingSenderId: "971866770236",
  appId: "1:971866770236:web:12129514b0294cdceaac39",
  measurementId: "G-JZEWPSVSPY"
};*/

const firebaseConfig = {
  apiKey: "AIzaSyAnjANsZGTinI0OGvlWFRQLlPUOi6D5Xw0",
  authDomain: "jobs-update-e3e63.firebaseapp.com",
  projectId: "jobs-update-e3e63",
  storageBucket: "jobs-update-e3e63.firebasestorage.app",
  messagingSenderId: "820889939052",
  appId: "1:820889939052:web:205b777b4a30dff7b73c49",
  measurementId: "G-VS5JKZBR1L"
};


let app: FirebaseApp;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  app = getApps()[0];
  db = getFirestore();
}

export { app, db };
