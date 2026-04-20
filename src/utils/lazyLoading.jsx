import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load pages for code splitting
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazySignup = lazy(() => import('../pages/Signup'));
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyAnalyzer = lazy(() => import('../pages/Analyzer'));
export const LazyHistory = lazy(() => import('../pages/History'));

/**
 * Lazy route wrapper with loading fallback
 */
export function LazyRoute({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen text="Loading page..." />}>
      {children}
    </Suspense>
  );
}

export default {
  LazyLogin,
  LazySignup,
  LazyDashboard,
  LazyAnalyzer,
  LazyHistory,
  LazyRoute
};
