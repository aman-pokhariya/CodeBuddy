import React, { createContext, useContext, useState, useCallback } from 'react';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all analyses for a user
  const fetchAnalyses = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(collection(db, 'analyses'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAnalyses(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analyses:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save a new analysis
  const saveAnalysis = useCallback(async (userId, analysisData) => {
    try {
      setError(null);
      setLoading(true);
      
      const analysisId = `analysis_${Date.now()}`;
      const docData = {
        userId,
        ...analysisData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'analyses', analysisId), docData);
      
      // Update local state
      setAnalyses(prev => [{ id: analysisId, ...docData }, ...prev]);
      
      return { id: analysisId, ...docData };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an analysis
  const updateAnalysis = useCallback(async (analysisId, updates) => {
    try {
      setError(null);
      setLoading(true);
      
      await updateDoc(doc(db, 'analyses', analysisId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setAnalyses(prev =>
        prev.map(analysis =>
          analysis.id === analysisId
            ? { ...analysis, ...updates, updatedAt: new Date().toISOString() }
            : analysis
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an analysis
  const deleteAnalysis = useCallback(async (analysisId) => {
    try {
      setError(null);
      setLoading(true);
      
      await deleteDoc(doc(db, 'analyses', analysisId));
      
      // Update local state
      setAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get analysis by ID
  const getAnalysis = useCallback(async (analysisId) => {
    try {
      const docSnap = await getDoc(doc(db, 'analyses', analysisId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    analyses,
    loading,
    error,
    fetchAnalyses,
    saveAnalysis,
    updateAnalysis,
    deleteAnalysis,
    getAnalysis
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use App Context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
