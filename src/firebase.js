import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfFoPb0tOMCU2XZSqSJdYvJYd9DQ0Vo4M",
  authDomain: "connex-sistema.firebaseapp.com",
  projectId: "connex-sistema",
  storageBucket: "connex-sistema.firebasestorage.app",
  messagingSenderId: "728159096799",
  appId: "1:728159096799:web:fbaf634efdbf1ccf917e6a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
