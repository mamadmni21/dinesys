/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuLDtjHxzSOp_ZF4a92K6UlyJAdJAo6-U",
  authDomain: "fleet-ai-mp.firebaseapp.com",
  projectId: "fleet-ai-mp",
  storageBucket: "fleet-ai-mp.firebasestorage.app",
  messagingSenderId: "167536850972",
  appId: "1:167536850972:web:7b1a1bff0e077399dd47d9"
};

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("Firebase app initialization failed", error);
}

export const auth = app ? getAuth(app) : null;

// Initialize Firestore with custom database ID
let dbInstance: Firestore | null = null;
if (app) {
  try {
    dbInstance = getFirestore(app, "ai-studio-39470171-6618-47c1-abc1-fbfa8ed92265");
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
