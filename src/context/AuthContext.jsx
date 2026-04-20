import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          // Fetch user profile from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // Update profile
      await updateProfile(firebaseUser, { displayName });
      
      // Create user document in Firestore
      const userData = {
        uid: firebaseUser.uid,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        analyses: 0,
        weakTopics: [],
        recentActivity: []
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      setUserProfile(userData);
      
      return firebaseUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
