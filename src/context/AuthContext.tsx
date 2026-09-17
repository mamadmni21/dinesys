/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Standard mock profile for zero-configuration preview
const MOCK_PROFILES: Record<string, UserProfile> = {
  'admin@dinesys.com': {
    uid: 'demo-admin-uid',
    email: 'admin@dinesys.com',
    displayName: 'Ahmad Sepuh',
    role: 'Super Admin',
    phoneNumber: '+62 811-2233-4455',
    businessUnit: 'All',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  'pmo@dinesys.com': {
    uid: 'demo-pmo-uid',
    email: 'pmo@dinesys.com',
    displayName: 'Ismanto PMO',
    role: 'PMO Manager',
    phoneNumber: '+62 812-3456-7890',
    businessUnit: 'All',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  'unit@dinesys.com': {
    uid: 'demo-unit-uid',
    email: 'unit@dinesys.com',
    displayName: 'Budi Santoso',
    role: 'Business Unit Manager',
    phoneNumber: '+62 813-9876-5432',
    businessUnit: 'IT Solution',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  'vendor@dinesys.com': {
    uid: 'demo-vendor-uid',
    email: 'vendor@dinesys.com',
    displayName: 'Mitra Trismatek',
    role: 'Vendor',
    phoneNumber: '+62 815-5555-7777',
    businessUnit: 'All',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  'talent@dinesys.com': {
    uid: 'demo-talent-uid',
    email: 'talent@dinesys.com',
    displayName: 'Rizky Pratama',
    role: 'Talent',
    phoneNumber: '+62 819-2222-3333',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  'finance@dinesys.com': {
    uid: 'demo-finance-uid',
    email: 'finance@dinesys.com',
    displayName: 'Siti Rahma',
    role: 'Finance',
    phoneNumber: '+62 817-4444-5555',
    status: 'Active',
    createdAt: new Date().toISOString()
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Sync profile to local storage for local persistence
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          setIsDemoMode(false);
          try {
            if (db) {
              const docRef = doc(db, 'users', firebaseUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
              } else {
                // If auth user exists but no Firestore profile yet, create one
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || 'Enterprise User',
                  role: 'Customer', // Default role
                  createdAt: new Date().toISOString(),
                  status: 'Active'
                };
                await setDoc(docRef, newProfile);
                setProfile(newProfile);
              }
            } else {
              throw new Error("No Firestore connection");
            }
          } catch (err) {
            console.warn("Firestore error, switching to secure demo-overlay profile for session:", err);
            // Fallback user state
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Enterprise User',
              role: 'Super Admin', // Provide full access under offline mode
              createdAt: new Date().toISOString(),
              status: 'Active'
            });
          }
        } else {
          // Check if there is an active local storage demo session
          const storedDemoProfile = localStorage.getItem('dinesys_demo_profile');
          if (storedDemoProfile) {
            try {
              const parsed = JSON.parse(storedDemoProfile);
              setProfile(parsed);
              setIsDemoMode(true);
            } catch {
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Complete Local-persistence Sandbox Mode
      setIsDemoMode(true);
      const storedDemoProfile = localStorage.getItem('dinesys_demo_profile');
      if (storedDemoProfile) {
        try {
          const parsed = JSON.parse(storedDemoProfile);
          setProfile(parsed);
        } catch {
          // Default start with Super Admin
          const def = MOCK_PROFILES['admin@dinesys.com'];
          setProfile(def);
          localStorage.setItem('dinesys_demo_profile', JSON.stringify(def));
        }
      } else {
        const def = MOCK_PROFILES['admin@dinesys.com'];
        setProfile(def);
        localStorage.setItem('dinesys_demo_profile', JSON.stringify(def));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Local check
      const matched = MOCK_PROFILES[email.toLowerCase()];
      if (matched) {
        setProfile(matched);
        setIsDemoMode(true);
        localStorage.setItem('dinesys_demo_profile', JSON.stringify(matched));
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Invalid credentials in offline demo sandbox. Try 'admin@dinesys.com', 'pmo@dinesys.com', or 'vendor@dinesys.com'.");
      }
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    if (auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        if (db) {
          const newProfile: UserProfile = {
            uid: userCredential.user.uid,
            email,
            displayName: name,
            role,
            createdAt: new Date().toISOString(),
            status: 'Active'
          };
          await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
          setProfile(newProfile);
        }
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Mock signup
      const newProfile: UserProfile = {
        uid: `demo-uid-${Date.now()}`,
        email,
        displayName: name,
        role,
        createdAt: new Date().toISOString(),
        status: 'Active'
      };
      setProfile(newProfile);
      setIsDemoMode(true);
      localStorage.setItem('dinesys_demo_profile', JSON.stringify(newProfile));
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Sign out failed", error);
      }
    }
    setUser(null);
    setProfile(null);
    setIsDemoMode(false);
    localStorage.removeItem('dinesys_demo_profile');
    setLoading(false);
  };

  const switchRole = (role: UserRole) => {
    if (profile) {
      const updated = { ...profile, role };
      setProfile(updated);
      if (isDemoMode) {
        localStorage.setItem('dinesys_demo_profile', JSON.stringify(updated));
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (profile) {
      const updated = { ...profile, ...data };
      setProfile(updated);
      if (auth && user && db) {
        try {
          await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
        } catch (err) {
          console.error("Error updating profile in firestore:", err);
        }
      } else {
        localStorage.setItem('dinesys_demo_profile', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || null,
        loading,
        isDemoMode,
        login,
        signUp,
        logout,
        switchRole,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
