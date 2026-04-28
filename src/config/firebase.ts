import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDemo-key-replace-me',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'healthcare-saas-demo.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'healthcare-saas-demo',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'healthcare-saas-demo.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence).catch(() => {});

export default app;
