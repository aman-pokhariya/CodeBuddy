# TESTING.md - Testing Guide & Strategy

## Testing Overview

CodeBuddy uses a comprehensive testing strategy to ensure code quality, reliability, and user satisfaction across all features.

## Testing Pyramid

```
        /\          Manual Testing
       /  \         (10-15%)
      /    \
     /------\       E2E Tests
    /        \      (10-15%)
   /          \
  /            \     Integration Tests
 /              \    (25-35%)
/________________\
   Unit Tests    (50-60%)
```

## 1. Unit Tests

### Testing Utilities

#### CodeAnalyzer
Test file: `__tests__/utils/codeAnalyzer.test.js`

```javascript
describe('CodeAnalyzer', () => {
  describe('analyze()', () => {
    test('should detect var usage', () => {
      const code = 'var x = 5;';
      const result = CodeAnalyzer.analyze(code);
      expect(result.issues).toContain(
        expect.objectContaining({ type: 'var-usage' })
      );
    });

    test('should calculate quality score correctly', () => {
      const code = 'const x = 5;';
      const result = CodeAnalyzer.analyze(code);
      expect(result.quality).toBeGreaterThan(80);
    });
  });

  describe('estimateTimeComplexity()', () => {
    test('should detect O(n) complexity', () => {
      const code = 'for (let i = 0; i < n; i++) { }';
      const complexity = CodeAnalyzer.estimateTimeComplexity(code);
      expect(complexity).toBe('O(n)');
    });

    test('should detect O(n²) complexity', () => {
      const code = 'for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) { } }';
      const complexity = CodeAnalyzer.estimateTimeComplexity(code);
      expect(complexity).toBe('O(n²)');
    });
  });
});
```

#### LearningEngine
Test file: `__tests__/utils/learningEngine.test.js`

```javascript
describe('LearningEngine', () => {
  describe('calculateProficiency()', () => {
    test('should calculate beginner proficiency', () => {
      const analyses = [
        { quality: 40 },
        { quality: 50 }
      ];
      const result = LearningEngine.calculateProficiency(analyses);
      expect(result.level).toBe('beginner');
    });

    test('should calculate expert proficiency', () => {
      const analyses = Array(20).fill({ quality: 90 });
      const result = LearningEngine.calculateProficiency(analyses);
      expect(result.level).toBe('expert');
    });
  });

  describe('generateLearningRecommendations()', () => {
    test('should return recommendations array', () => {
      const analyses = mockAnalyses;
      const recommendations = LearningEngine.generateLearningRecommendations(analyses);
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});
```

#### Helper Functions
Test file: `__tests__/utils/helpers.test.js`

```javascript
describe('Helper Functions', () => {
  describe('validateEmail()', () => {
    test('should validate correct email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });

  describe('validatePassword()', () => {
    test('should validate strong password', () => {
      const result = validatePassword('SecurePassword123');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
    });

    test('should detect weak password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('weak');
    });
  });

  describe('debounce()', () => {
    test('should debounce function calls', (done) => {
      const mock = jest.fn();
      const debounced = debounce(mock, 100);
      
      debounced();
      debounced();
      debounced();
      
      expect(mock).not.toHaveBeenCalled();
      
      setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });
});
```

### Running Unit Tests
```bash
npm test -- --testPathPattern=utils
npm test -- --coverage
```

## 2. Component Tests

### Button Component Test
Test file: `__tests__/components/Button.test.jsx`

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant styles', () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    expect(container.firstChild).toHaveClass('bg-purple-600');
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

### Input Component Test
Test file: `__tests__/components/Input.test.jsx`

```javascript
describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalled();
    expect(input.value).toBe('test');
  });

  test('displays error message', () => {
    render(
      <Input 
        label="Email" 
        error="Invalid email"
      />
    );
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });
});
```

### Running Component Tests
```bash
npm test -- --testPathPattern=components
npm test -- Button.test.jsx
```

## 3. Integration Tests

### Authentication Flow Test
Test file: `__tests__/integration/authFlow.test.js`

```javascript
describe('Authentication Flow', () => {
  test('complete signup and login flow', async () => {
    // 1. Sign up
    const { getByLabelText, getByText } = render(<Signup />);
    
    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.click(getByText('Sign Up'));

    // 2. Wait for redirect
    await waitFor(() => {
      expect(history.location.pathname).toBe('/dashboard');
    });

    // 3. Verify user data
    const { userProfile } = useAuth();
    expect(userProfile.email).toBe('test@example.com');
  });
});
```

### Code Analysis Flow Test
Test file: `__tests__/integration/analyzeFlow.test.js`

```javascript
describe('Code Analysis Flow', () => {
  test('analyze code and save to history', async () => {
    // 1. Navigate to analyzer
    render(<Analyzer />);

    // 2. Enter code
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: 'var x = 5;' }
    });

    // 3. Click analyze
    fireEvent.click(screen.getByText('Analyze'));

    // 4. Wait for results
    await waitFor(() => {
      expect(screen.getByText(/Quality:/)).toBeInTheDocument();
    });

    // 5. Save analysis
    fireEvent.click(screen.getByText('Save'));
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'My Analysis' }
    });
    fireEvent.click(screen.getByText('Save Analysis'));

    // 6. Verify saved in history
    const { analyses } = useApp();
    expect(analyses).toContainEqual(
      expect.objectContaining({ title: 'My Analysis' })
    );
  });
});
```

### Running Integration Tests
```bash
npm test -- --testPathPattern=integration
npm test -- --testType=integration
```

## 4. E2E Tests (Cypress/Playwright)

### Cypress Test Example
Test file: `e2e/auth.cy.js`

```javascript
describe('Authentication E2E', () => {
  it('should sign up and log in', () => {
    // Sign up
    cy.visit('http://localhost:5173/signup');
    cy.get('input[name="displayName"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('SecurePass123');
    cy.get('button:contains("Sign Up")').click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Welcome back, Test User');

    // Log out
    cy.get('button:contains("Log Out")').click();
    cy.url().should('include', '/login');
  });
});
```

### Playwright Test Example
Test file: `tests/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication E2E', () => {
  test('should sign up and navigate to dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
    
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    
    await page.click('button:has-text("Sign Up")');
    
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back');
  });
});
```

### Running E2E Tests
```bash
# Cypress
npx cypress open
npx cypress run

# Playwright
npx playwright test
npx playwright test --ui
```

## 5. Manual Testing Checklist

### Authentication Features
- [ ] Sign up with valid email/password
- [ ] Sign up validation (empty fields, weak password)
- [ ] Login with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Password strength indicator works
- [ ] Logout clears session
- [ ] Protected routes redirect to login

### Code Analyzer
- [ ] Enter valid code in editor
- [ ] Select different languages
- [ ] Analyze button works
- [ ] Results display correctly
- [ ] Quality score calculates
- [ ] Issues/warnings display
- [ ] Recommendations show
- [ ] Save analysis modal appears
- [ ] Saved analysis appears in history
- [ ] Clear button works

### History
- [ ] List shows all saved analyses
- [ ] Search filters by title
- [ ] Language filter works
- [ ] Sort by recent/quality works
- [ ] View analysis shows details
- [ ] Export downloads JSON file
- [ ] Delete removes from list
- [ ] Delete confirmation appears

### Dashboard
- [ ] Statistics display correctly
- [ ] Charts render
- [ ] Weak topics show
- [ ] Recent activity updates
- [ ] Navigation links work
- [ ] Quick actions work

### Responsive Design
- [ ] Mobile (375px): Stacked layout
- [ ] Tablet (768px): 2-column layout
- [ ] Desktop (1024px): Full layout
- [ ] No horizontal scrolling
- [ ] Touch targets >= 44px
- [ ] Text readable at all sizes
- [ ] Images scale correctly

## 6. Performance Testing

### Lighthouse Audit
```bash
# Run Lighthouse from Chrome DevTools
# Target scores:
# - Performance: 85+
# - Accessibility: 90+
# - Best Practices: 85+
# - SEO: 85+
```

### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build
npm install -g size-limit
npx size-limit

# Expected size: < 450KB gzipped
```

### Memory Leaks
- Open DevTools Memory tab
- Take heap snapshot before and after interactions
- Check for retained objects
- Look for detached DOM nodes

## 7. Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] All buttons accessible via keyboard
- [ ] Form fields navigable
- [ ] Modals trappable with Tab/Shift+Tab
- [ ] Escape closes modals

### Screen Reader Testing
- [ ] Use NVDA (Windows) or VoiceOver (Mac)
- [ ] All labels read correctly
- [ ] Icons have alt text
- [ ] Buttons clearly identified
- [ ] Form errors announced

### Color Contrast
- [ ] Text meets WCAG AA standards (4.5:1)
- [ ] Interactive elements clear
- [ ] Use https://webaim.org/resources/contrastchecker/

## 8. Bug Fixing Workflow

### Step 1: Reproduce Bug
```javascript
// Create minimal test case
describe('Bug: Analyses not loading', () => {
  test('should load analyses on dashboard mount', async () => {
    const { getByText } = render(<Dashboard />);
    await waitFor(() => {
      expect(getByText(/Total Analyses/)).toBeInTheDocument();
    });
  });
});
```

### Step 2: Identify Root Cause
- Check console errors
- Use DevTools debugger
- Add console.log statements
- Check network tab

### Step 3: Fix Bug
- Make targeted fix
- Run test to verify
- Check related functionality

### Step 4: Prevent Regression
- Add test case
- Document in CHANGELOG
- Commit with "fix:" prefix

## 9. Test Data & Mocks

### Mock Firebase
```javascript
jest.mock('../services/firebase', () => ({
  auth: {
    currentUser: { uid: 'test-uid', email: 'test@example.com' }
  },
  onAuthStateChanged: jest.fn((callback) => {
    callback({ uid: 'test-uid', email: 'test@example.com' });
    return () => {};
  })
}));
```

### Mock Analyses Data
```javascript
export const mockAnalyses = [
  {
    id: '1',
    title: 'Test Analysis 1',
    code: 'const x = 5;',
    language: 'javascript',
    quality: 85,
    createdAt: new Date().toISOString(),
    tags: ['javascript']
  },
  {
    id: '2',
    title: 'Test Analysis 2',
    code: 'function test() { }',
    language: 'javascript',
    quality: 90,
    createdAt: new Date().toISOString(),
    tags: ['javascript', 'functions']
  }
];
```

## 10. CI/CD Integration

### GitHub Actions
File: `.github/workflows/test.yml`

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build
```

## 11. Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.jsx

# Run tests in watch mode
npm test -- --watch

# Run tests matching pattern
npm test -- --testNamePattern="analyze"

# Run integration tests only
npm test -- --testPathPattern=integration

# Update snapshots
npm test -- -u
```

## 12. Coverage Goals

| Category | Target |
|----------|--------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

## 13. Common Testing Issues

### Issue: Firebase Mock Not Working
**Solution**: Mock before component import
```javascript
jest.mock('../services/firebase');
import { auth } from '../services/firebase';
```

### Issue: Async Tests Timing Out
**Solution**: Increase timeout
```javascript
test('async operation', async () => {
  // test
}, 10000); // 10 second timeout
```

### Issue: State Not Updating in Tests
**Solution**: Use waitFor
```javascript
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

---

**Document**: Testing Guide
**Version**: 1.0.0
**Last Updated**: 2024
**Author**: Aman Pokhariya
