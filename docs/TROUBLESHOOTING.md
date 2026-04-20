# TROUBLESHOOTING.md - Common Issues & Solutions

## Table of Contents
1. [Installation Issues](#installation-issues)
2. [Firebase Issues](#firebase-issues)
3. [Runtime Errors](#runtime-errors)
4. [Performance Issues](#performance-issues)
5. [Responsive Design Issues](#responsive-design-issues)
6. [Deployment Issues](#deployment-issues)

---

## Installation Issues

### Issue: npm install fails
**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or update npm
npm install -g npm@latest
npm install
```

### Issue: Vite fails to start
**Error**: `Error: Cannot find module 'vite'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

### Issue: React version mismatch
**Error**: `Warning: React does not recognize...`

**Solution**:
```bash
# Check versions match in package.json
npm list react react-dom

# Update to latest
npm install react@latest react-dom@latest
```

### Issue: PostCSS not found
**Error**: `Error: PostCSS plugin ... requires PostCSS`

**Solution**:
```bash
# Install PostCSS
npm install -D postcss

# Create postcss.config.js
```

---

## Firebase Issues

### Issue: Firebase Config Not Loading
**Error**: `TypeError: Cannot read property 'apiKey' of undefined`

**Solution**:
```javascript
// Check .env.local exists
// cat .env.local

// Verify environment variables
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

// Restart dev server
npm run dev
```

### Issue: Authentication Fails
**Error**: `auth/invalid-api-key` or `auth/permission-denied`

**Solution**:
```bash
# 1. Check Firebase console:
# - Project Settings > General tab
# - Copy exact config values

# 2. Verify in .env.local:
VITE_FIREBASE_API_KEY=your_exact_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

# 3. Enable Email/Password auth:
# Firebase Console > Authentication > Sign-in method

# 4. Restart dev server
npm run dev
```

### Issue: Firestore Database Errors
**Error**: `FirebaseError: [code=permission-denied]`

**Solution**:
```javascript
// 1. Check Firestore rules in Firebase Console
// For development:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

// 2. Verify userId matches auth.uid
// 3. Check Firestore rules are saved
```

### Issue: User Data Not Saving
**Error**: Analysis saves but doesn't appear in history

**Solution**:
```javascript
// 1. Check Firestore collection structure
// Should have: analyses collection with userId field

// 2. Verify user is authenticated
const { user } = useAuth();
console.log('Current user:', user?.uid);

// 3. Check async/await
await saveAnalysis(...);
await fetchAnalyses(user.uid);
```

### Issue: Real-Time Updates Not Working
**Error**: Data doesn't update without page refresh

**Solution**:
```javascript
// 1. Verify onSnapshot listener is set up
// 2. Check dependency array in useEffect
useEffect(() => {
  const unsubscribe = onSnapshot(query, (snapshot) => {
    // Handle updates
  });
  return () => unsubscribe(); // Cleanup
}, [user.uid]); // Include dependencies

// 3. Check Firestore rules allow read
```

---

## Runtime Errors

### Issue: "Cannot read property 'uid' of undefined"
**Error**: TypeError when accessing user.uid

**Solution**:
```javascript
// 1. Check if user is loaded
if (!user) return <LoadingSpinner />;

// 2. Use optional chaining
const userId = user?.uid;

// 3. Check context provider setup
// App.jsx should wrap with AuthProvider
```

### Issue: "Code not found" in Analysis
**Error**: Analysis shows empty code field

**Solution**:
```javascript
// 1. Check textarea value binding
value={code}
onChange={(e) => setCode(e.target.value)}

// 2. Verify code saved correctly
console.log('Code to save:', code);

// 3. Check Firestore document structure
```

### Issue: Charts Not Rendering
**Error**: Recharts display area is blank

**Solution**:
```javascript
// 1. Check data format
console.log('Chart data:', statistics.qualityTrend);

// 2. Verify ResponsiveContainer parent has height
<div style={{ height: 300 }}>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>

// 3. Check Recharts import
import { LineChart, Line, ... } from 'recharts';
```

### Issue: Modal Not Closing
**Error**: Modal stays open after action

**Solution**:
```javascript
// 1. Check state update
setShowModal(false); // Make sure this is called

// 2. Verify onClick handler
<Button onClick={() => setShowModal(false)}>Close</Button>

// 3. Check modal backdrop click
onClick={() => setShowModal(false)}
```

---

## Performance Issues

### Issue: App Loads Slowly
**Solution**:
```bash
# 1. Check bundle size
npm run build
# Check dist/ folder size

# 2. Profile in Chrome DevTools
# DevTools > Performance tab > Record

# 3. Analyze with Lighthouse
# DevTools > Lighthouse > Analyze

# 4. Optimize code splitting
# Already implemented with lazy()
```

### Issue: Input Lag / Slow Typing
**Error**: Typing in code editor feels sluggish

**Solution**:
```javascript
// 1. Implement debouncing
const debouncedAnalyze = useCallback(
  debounce(() => handleAnalyze(), 300),
  []
);

// 2. Move expensive operations out of render
// Use useMemo for calculations

// 3. Check for memory leaks
// DevTools > Memory > Take heap snapshot
```

### Issue: Memory Leak Warnings
**Error**: Warning about unmounted components

**Solution**:
```javascript
// 1. Always cleanup effects
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  return () => unsubscribe(); // Cleanup
}, []);

// 2. Clear timeouts
useEffect(() => {
  const timer = setTimeout(() => {}, 3000);
  return () => clearTimeout(timer);
}, []);

// 3. Remove event listeners
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## Responsive Design Issues

### Issue: Mobile Layout Broken
**Error**: Layout doesn't stack on mobile

**Solution**:
```jsx
// Use correct Tailwind classes
// Avoid absolute positioning on mobile

// Good:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Bad:
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

// Test breakpoints
// Open DevTools > Toggle device toolbar (Ctrl+Shift+M)
```

### Issue: Text Too Small on Mobile
**Error**: Cannot read text on phone

**Solution**:
```jsx
// Use responsive font sizes
<h1 className="text-xl md:text-2xl lg:text-3xl">Heading</h1>
<p className="text-sm md:text-base">Body text</p>

// Minimum font size: 16px on mobile
```

### Issue: Horizontal Scrolling
**Error**: Scroll bar appears at bottom

**Solution**:
```jsx
// 1. Check for overflow-x
// Don't use width: 100vw (use 100%)

// 2. Add overflow wrapper
<div className="overflow-x-hidden">
  Content
</div>

// 3. Check max-width
<div className="max-w-full">
  {/* Not max-w-screen */}
</div>
```

### Issue: Touch Targets Too Small
**Error**: Hard to tap buttons on mobile

**Solution**:
```jsx
// Minimum 44x44px touch target
<Button className="h-12 px-4">
  Touch-friendly button
</Button>

// Check with DevTools Device Mode
```

---

## Deployment Issues

### Issue: Build Fails
**Error**: `npm run build` errors

**Solution**:
```bash
# 1. Clear cache
rm -rf node_modules dist
npm install

# 2. Check environment variables
cat .env.production

# 3. Run build with verbose output
npm run build -- --debug

# 4. Check for linting errors
npm run lint
```

### Issue: 404 on Refresh
**Error**: Direct URL navigation shows 404

**Solution**:
```javascript
// Firebase: Check rewrites in firebase.json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]

// Vercel: Check vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

// Netlify: Check netlify.toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Issue: Environment Variables Not Working
**Error**: Undefined environment variables in production

**Solution**:
```bash
# 1. Use correct prefix: VITE_
VITE_FIREBASE_API_KEY=value

# 2. Verify in deployment platform
# Firebase: Check build script
# Vercel: Check Environment Variables tab
# Netlify: Check Build & Deploy settings

# 3. Restart deployment
firebase deploy
vercel --prod
netlify deploy --prod
```

### Issue: Firebase Token Expired
**Error**: Deployment auth fails

**Solution**:
```bash
# 1. Get new token
firebase login:ci

# 2. Update in CI/CD platform
# GitHub Actions: Update FIREBASE_TOKEN secret

# 3. Re-run deployment
```

---

## Debug Tips

### Enable Debug Logging
```javascript
// src/main.jsx
if (import.meta.env.DEV) {
  // Enable Firebase debug logging
  import('firebase/firestore').then(({ enableLogging }) => {
    enableLogging(true);
  });

  // Log performance metrics
  import('./utils/performance').then(({ reportWebVitals }) => {
    reportWebVitals();
  });
}
```

### Chrome DevTools Techniques
```javascript
// 1. Breakpoints
// Click line number to add breakpoint

// 2. Conditional Breakpoints
// Right-click > Add conditional breakpoint
// Enter condition: user.uid === 'test-uid'

// 3. Watch Expressions
// Add: user.uid, analyses.length

// 4. Performance Recording
// Performance tab > Record > Interact > Stop

// 5. Network Throttling
// Network tab > Slow 3G > Reproduce issue
```

### Console Debugging
```javascript
// Log component props
console.log({ props });

// Inspect object structure
console.table(analyses);

// Measure performance
console.time('analyzeCode');
// code
console.timeEnd('analyzeCode');

// Clear console
console.clear();
```

---

## Getting Help

### Where to Look
1. **Console Errors** - Chrome DevTools > Console
2. **Network Errors** - Chrome DevTools > Network
3. **Firebase Errors** - Firebase Console > Logs
4. **Performance** - Chrome DevTools > Performance & Lighthouse

### Common Search Terms
- Error message + "React"
- "Firebase" + error code
- "Tailwind CSS" + issue
- "Vite" + problem

### Stack Overflow
- Provide minimal reproducible example
- Include error message and stack trace
- Show relevant code snippets

---

**Document**: Troubleshooting Guide
**Version**: 1.0.0
**Last Updated**: 2024
**Author**: Aman Pokhariya
