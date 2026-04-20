# ARCHITECTURE.md - CodeBuddy System Architecture

## System Overview

CodeBuddy follows a modern React architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  (Pages: Login, Signup, Dashboard, Analyzer, History)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Component Layer                            │
│  (UI Components: Button, Input, Card, Modal, etc.)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   State Management Layer                     │
│  (Context API: AuthContext, AppContext)                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  (Utils: CodeAnalyzer, LearningEngine, Helpers)             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Services Layer                             │
│  (Firebase: Auth, Firestore)                                │
└─────────────────────────────────────────────────────────────┘
```

## Layer Details

### 1. Pages Layer
- **Login.jsx**: Authentication entry point
- **Signup.jsx**: User registration
- **Dashboard.jsx**: Main dashboard with analytics
- **Analyzer.jsx**: Code analysis interface
- **History.jsx**: Analysis history and CRUD

**Responsibilities:**
- Route-specific logic
- Page-level state management
- Component composition

### 2. Component Layer
Reusable UI components with consistent API:
- **Button**: CTA with variants
- **Input**: Form input with validation
- **Card**: Content container
- **Modal**: Dialog for user actions
- **Badge**: Status/tag display
- **LoadingSpinner**: Loading state
- **Alerts**: Error/success messaging
- **Navbar**: Navigation

**Responsibilities:**
- Visual presentation
- User interaction handling
- Accessibility

### 3. State Management Layer
Context API provides global state:

**AuthContext:**
- User authentication state
- Login/signup/logout methods
- Auth persistence

**AppContext:**
- Analysis CRUD operations
- Loading/error states
- Data synchronization

**Pattern:**
```
Context → useContext Hook → Components
```

### 4. Business Logic Layer
Utility functions and classes for business operations:

**CodeAnalyzer:**
- Code quality analysis
- Issue detection
- Complexity calculation
- Recommendations

**LearningEngine:**
- Proficiency calculation
- Recommendation generation
- Learning path creation

**Helpers:**
- Validation (email, password)
- Formatting (date, text)
- Utilities (ID generation, debounce)

### 5. Services Layer
Firebase integration for backend:

**Firebase Auth:**
- User registration
- Email/password authentication
- Session management

**Firestore:**
- User data persistence
- Analysis storage
- Real-time synchronization

## Data Flow

### Authentication Flow
```
1. User enters credentials
2. Signup/Login page validates
3. Firebase Auth processes
4. AuthContext updates
5. Protected routes allow access
6. Firestore user document created
```

### Code Analysis Flow
```
1. User enters code + language
2. Analyzer page submits
3. CodeAnalyzer.analyze() processes
4. Results displayed
5. User optionally saves
6. AppContext stores in Firestore
7. History page reflects new entry
```

### Learning Recommendation Flow
```
1. Dashboard loads analyses
2. LearningEngine.calculateProficiency()
3. Weak areas identified
4. Recommendations generated
5. Learning path created
6. Dashboard displays suggestions
```

## Component Communication

### Parent-to-Child (Props)
```javascript
<Button 
  variant="primary" 
  onClick={handleClick}
  children="Click Me"
/>
```

### Child-to-Parent (Callbacks)
```javascript
<Input 
  value={email} 
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Sibling Communication (Context)
```javascript
const { user } = useAuth(); // Via AuthContext
const { analyses } = useApp(); // Via AppContext
```

### Deeply Nested (Context Provider)
```
App → AuthProvider → Pages → Components → useAuth()
```

## Scalability Considerations

### Adding New Features
1. **Create Page Component** in `src/pages/`
2. **Create Context Reducer** if new global state
3. **Add Route** in `App.jsx`
4. **Create UI Components** if reusable
5. **Add Utilities** for business logic
6. **Update Navigation** in `Navbar.jsx`

### Example: Adding Achievements Feature
```
src/pages/Achievements.jsx
src/context/AchievementsContext.jsx
src/utils/achievementEngine.js
src/components/AchievementCard.jsx
```

### Adding New Analysis Language
```javascript
// In CodeAnalyzer.analyze()
switch (language) {
  case 'python':
    return this.analyzePython(code);
  case 'java':
    return this.analyzeJava(code);
  // Add new language
  case 'rust':
    return this.analyzeRust(code);
}
```

## Error Handling Strategy

### Client-Side Validation
```javascript
const { isValid, errors } = validateEmail(email);
if (!isValid) {
  setError(errors[0]);
  return;
}
```

### Firebase Error Handling
```javascript
try {
  await signUp(email, password);
} catch (error) {
  if (error.code === 'auth/email-already-in-use') {
    setError('Email already registered');
  }
}
```

### Component Error Boundaries (Future)
```javascript
<ErrorBoundary fallback={<ErrorPage />}>
  <Dashboard />
</ErrorBoundary>
```

## Performance Optimization Patterns

### Memoization
```javascript
const statistics = useMemo(() => ({
  total: analyses.length,
  average: calculateAverage(analyses)
}), [analyses]);
```

### Callback Optimization
```javascript
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### Code Splitting
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

## Testing Architecture (Future)

### Unit Tests
```
__tests__/utils/codeAnalyzer.test.js
__tests__/utils/learningEngine.test.js
__tests__/helpers.test.js
```

### Component Tests
```
__tests__/components/Button.test.jsx
__tests__/pages/Analyzer.test.jsx
```

### Integration Tests
```
__tests__/integration/authFlow.test.js
__tests__/integration/analyzeFlow.test.js
```

## Deployment Architecture

### Development
```
npm run dev
→ Vite dev server on localhost:5173
→ Hot module replacement
```

### Production
```
npm run build
→ Optimized bundle
→ Code splitting
→ Minification
→ Firebase Hosting deployment
```

## Security Architecture

### Authentication
- Firebase Auth handles credentials
- No passwords stored in client
- JWT tokens managed by Firebase

### Authorization
- ProtectedRoute component validates auth
- Firestore rules enforce data ownership
- API calls include auth tokens

### Data Protection
- Firebase Firestore encryption at rest
- HTTPS for all communications
- Environment variables for secrets

## Database Queries Optimization

### Indexes
```
Firestore Composite Indexes:
- users collection: userId + createdAt
- analyses collection: userId + createdAt
- analyses collection: userId + language
```

### Query Patterns
```javascript
// Indexed query - fast
db.collection('analyses')
  .where('userId', '==', uid)
  .orderBy('createdAt', 'desc')
  .limit(10)
```

---

**Document**: System Architecture
**Version**: 1.0.0
**Last Updated**: 2024
**Author**: Aman Pokhariya
