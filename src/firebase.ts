import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const signInWithDiscordAnonymous = async () => {
  try {
    const userCred = await signInAnonymously(auth);
    return userCred.user;
  } catch (error) {
    console.error("Error signing in anonymously", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('discord_profile');
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
