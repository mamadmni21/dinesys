/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fleet-ai-mp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fleet-ai-mp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fleet-ai-mp.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "167536850972",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:167536850972:web:7b1a1bff0e077399dd47d9"
};

// Initialize Firebase
let app;
try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  } else {
    console.warn("VITE_FIREBASE_API_KEY is not set; skipping live Firebase initialization.");
  }
} catch (error) {
  console.error("Firebase app initialization failed", error);
}

export const auth = app ? getAuth(app) : null;

// Initialize Firestore with custom database ID
let dbInstance: Firestore | null = null;
if (app) {
  try {
    const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-39470171-6618-47c1-abc1-fbfa8ed92265";
    dbInstance = getFirestore(app, dbId);
  } catch (error) {
    console.error("Firestore database initialization failed, falling back to default.", error);
    try {
      dbInstance = getFirestore(app);
    } catch (e) {
      console.error("Default Firestore initialization failed.", e);
    }
  }
}

export const db = dbInstance;
export { app };
