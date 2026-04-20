# DEVELOPMENT-GUIDE.md - Getting Started for Developers

## Welcome to CodeBuddy! 👋

This guide helps you understand the codebase and start contributing to CodeBuddy.

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- A code editor (VSCode recommended)
- Firebase account

### Setup (5 minutes)
```bash
# Clone repository
git clone https://github.com/aman-pokhariya/CodeBuddy.git
cd CodeBuddy

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add Firebase credentials to .env.local
# (Get from Firebase Console)

# Start development server
npm run dev

# Open http://localhost:5173 in browser
```

## Project Structure

```
CodeBuddy/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components (Login, Dashboard, etc.)
│   ├── context/            # Global state (Auth, App)
│   ├── services/           # External services (Firebase)
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions & engines
│   ├── App.jsx             # Root component with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── docs/                   # Documentation
├── public/                 # Static assets
├── index.html              # HTML entry
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies
└── README.md               # Project overview
```

## Core Concepts

### State Management with Context API

```javascript
// Using authentication context
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, userProfile, signup, login, logout } = useAuth();
  
  // user: Current Firebase user
  // userProfile: Extended user data from Firestore
  // signup: Signup function
  // login: Login function
  // logout: Logout function
}
```

```javascript
// Using app context
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { 
    analyses,      // Array of analyses
    saveAnalysis,  // Save new analysis
    updateAnalysis, // Update existing
    deleteAnalysis, // Delete analysis
    fetchAnalyses   // Fetch all analyses
  } = useApp();
}
```

### Custom Hooks

```javascript
// Form handling
const { formData, setFormData, handleSubmit } = useForm(
  { email: '', password: '' },
  onSubmitCallback
);

// Debouncing
const debouncedSearch = useDebounce(searchTerm, 300);

// Local storage
const [value, setValue] = useLocalStorage('key', defaultValue);
```

### Code Analysis

```javascript
import { CodeAnalyzer } from '../utils/codeAnalyzer';

const result = CodeAnalyzer.analyze(code);
// Returns: { quality, issues, warnings, metrics, timeComplexity }

const recommendations = CodeAnalyzer.getRecommendations(result);
// Returns: Array of improvement suggestions
```

## Common Development Tasks

### Adding a New Page

1. Create component in `src/pages/NewPage.jsx`
```javascript
function NewPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white">New Page</h1>
      </div>
    </div>
  );
}

export default NewPage;
```

2. Add route in `src/App.jsx`
```javascript
import NewPage from './pages/NewPage';

// Inside AppContent component
<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

3. Update navigation in `src/components/Navbar.jsx`
```javascript
<Link to="/new-page">New Page</Link>
```

### Adding a New Component

1. Create in `src/components/NewComponent.jsx`
```javascript
import PropTypes from 'prop-types';

function NewComponent({ title, onClick, children }) {
  return (
    <div onClick={onClick} className="p-4 bg-gray-800 rounded">
      <h2 className="text-white font-bold">{title}</h2>
      {children}
    </div>
  );
}

NewComponent.propTypes = {
  title: PropTypes.string.required,
  onClick: PropTypes.func,
  children: PropTypes.node
};

export default NewComponent;
```

2. Export from `src/components/index.js`
```javascript
export { default as NewComponent } from './NewComponent';
```

3. Use in other components
```javascript
import { NewComponent } from '../components';

<NewComponent title="Hello" onClick={handleClick}>
  Content
</NewComponent>
```

### Adding a New Utility Function

1. Create in `src/utils/myUtils.js`
```javascript
export function myFunction(param) {
  // Implementation
  return result;
}
```

2. Use in components
```javascript
import { myFunction } from '../utils/myUtils';

const result = myFunction(value);
```

### Working with Firestore

```javascript
// Reading data
const { analyses, loading } = useApp();

// Saving data
const { saveAnalysis } = useApp();
await saveAnalysis(userId, {
  title: 'My Analysis',
  code: codeContent,
  language: 'javascript'
});

// Updating data
const { updateAnalysis } = useApp();
await updateAnalysis(analysisId, {
  title: 'Updated Title'
});

// Deleting data
const { deleteAnalysis } = useApp();
await deleteAnalysis(analysisId);
```

## Styling Guidelines

### Tailwind CSS Classes
```jsx
// Responsive classes
<div className="px-4 sm:px-6 lg:px-8">
  // 4px padding mobile, 6px tablet, 8px desktop
</div>

// Dark theme
<div className="bg-gray-950 text-white">
  // Dark background, white text
</div>

// Interactive states
<button className="hover:bg-purple-700 focus:outline-none focus:ring-2">
  Button
</button>

// Spacing
<div className="mb-4 md:mb-6 lg:mb-8">
  // Responsive bottom margin
</div>
```

### Component Styling Pattern
```jsx
function Component() {
  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
      </div>
    </div>
  );
}
```

## Performance Best Practices

### Use useMemo for Expensive Calculations
```javascript
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]);
```

### Use useCallback for Event Handlers
```javascript
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### Lazy Load Routes
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### Debounce Frequent Operations
```javascript
const debouncedSearch = useCallback(
  debounce((term) => search(term), 300),
  []
);
```

## Testing

### Run Tests
```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- Button.test.jsx # Specific test
npm test -- --watch         # Watch mode
```

### Write a Test
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });
});
```

## Debugging

### Chrome DevTools
1. Open DevTools (F12)
2. Sources tab: Set breakpoints
3. Console tab: Log variables
4. Performance tab: Profile app
5. Network tab: Check API calls

### React DevTools Extension
- Inspect component props
- Track state changes
- Profile component renders

### Debug Code in VS Code
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverride": {
        "webpack:///./src/*": "${webspaceFolder}/src/*"
      }
    }
  ]
}
```

## Git Workflow

### Commit Message Format
```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

```bash
git commit -m "feat(analyzer): add code complexity detection"
git commit -m "fix(dashboard): correct statistics calculation"
git commit -m "docs(readme): update setup instructions"
```

### Creating a Feature Branch
```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create Pull Request on GitHub
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Linting
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues

# Testing
npm test                 # Run tests
npm test -- --coverage   # With coverage

# Firebase
firebase login           # Login to Firebase
firebase deploy          # Deploy app
```

## Useful Resources

### Documentation
- [React Docs](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev/guide/)

### Learning
- [React Patterns](https://react-patterns.com)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Web Performance](https://web.dev/performance/)

### Tools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react-devtools-tutorial.vercel.app/)
- [VS Code Extensions](https://marketplace.visualstudio.com/)

## Code Quality Standards

### Before Committing
1. Run linter: `npm run lint:fix`
2. Run tests: `npm test`
3. Build: `npm run build`
4. Manual testing: `npm run dev`

### Code Review Checklist
- [ ] Code follows style guide
- [ ] Tests included and passing
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Performance acceptable
- [ ] Accessibility considered
- [ ] Responsive design tested

## Getting Help

### Troubleshooting
- Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- Search console errors in Chrome DevTools
- Check Firebase console for errors

### Documentation
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Performance Guide](./docs/PERFORMANCE.md)
- [Testing Guide](./docs/TESTING.md)
- [Responsive Design Guide](./docs/RESPONSIVE-DESIGN.md)

### Community
- GitHub Issues: Report bugs
- Pull Requests: Submit code
- Discussions: Ask questions

## Tips for New Developers

1. **Start Small**: Understand one component at a time
2. **Read Code**: Look at similar implementations
3. **Ask Questions**: Don't hesitate to ask
4. **Test Often**: Run tests after each change
5. **Document**: Add comments to complex logic
6. **Commit Often**: Small, focused commits
7. **Review Code**: Learn from others' implementations
8. **Be Patient**: Complex systems take time to understand

## Project Statistics

- **Total Components**: 10+
- **Total Utilities**: 15+
- **Lines of Code**: 5000+
- **Documentation Pages**: 6
- **Test Coverage**: Ready for 80%+
- **Bundle Size**: ~450KB (gzipped)

---

**Document**: Development Guide
**Version**: 1.0.0
**Last Updated**: 2024
**Author**: Aman Pokhariya

**Happy Coding!** 🚀
