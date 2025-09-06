import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuration Firebase - Remplacer par vos vraies valeurs
const firebaseConfig = {
  apiKey: "AIzaSyC4dtUWT7C7lZo_-XjtSzjqU9BaI_nRfW8",
  authDomain: "ocp-reservation-system.firebaseapp.com",
  projectId: "ocp-reservation-system",
  storageBucket: "ocp-reservation-system.appspot.com",
  messagingSenderId: "683115291573",
  appId: "1:683115291573:android:1f33012cfcb19613462ffc"
};

// Initialiser Firebase (éviter la double initialisation)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialiser Auth
export const auth = getAuth(app);

export default app;
