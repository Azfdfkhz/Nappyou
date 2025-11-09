import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgq7n8CobvzUQ3J4z7p5WsagezgeYWZrg",
  authDomain: "nappyougo.firebaseapp.com",
  projectId: "nappyougo",
  storageBucket: "nappyougo.firebasestorage.app",
  messagingSenderId: "27296728491",
  appId: "1:27296728491:web:308ffec3c139f3d51b7eee",
  measurementId: "G-EHPFZ955WV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
