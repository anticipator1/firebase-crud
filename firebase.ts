import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWKx0qmXdqdZ-CRnGhuRC9FwxwnLwT6rg",
  authDomain: "sales-7c045.firebaseapp.com",
  projectId: "sales-7c045",
  storageBucket: "sales-7c045.appspot.com",
  messagingSenderId: "123644888942",
  appId: "1:123644888942:web:59a92f3f14564f6820a37f"
};


// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth };
export default db;
