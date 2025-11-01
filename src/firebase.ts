import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBfLIRZrt_ygX7IMbtZG2hs0N0RC_-JjlU",
  authDomain: "weather-analytics-dashbo-428cc.firebaseapp.com",
  projectId: "weather-analytics-dashbo-428cc",
  storageBucket: "weather-analytics-dashbo-428cc.firebasestorage.app",
  messagingSenderId: "870864362275",
  appId: "1:870864362275:web:bb023d595910b6be108a96",
  measurementId: "G-NV4JZ885M2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();