# DEPLOYMENT.md - Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Firebase credentials added to `.env.local`

### Performance
- [ ] Lighthouse score > 85
- [ ] Bundle size < 500KB gzipped
- [ ] No memory leaks detected
- [ ] Images optimized
- [ ] Code splitting working

### Security
- [ ] No secrets in source code
- [ ] Environment variables not exposed
- [ ] Firebase rules configured
- [ ] CORS properly set up
- [ ] Input validation implemented

### Documentation
- [ ] README.md updated
- [ ] Deployment steps documented
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Contributing guide updated

### Testing
- [ ] All features manually tested
- [ ] Responsive design tested on devices
- [ ] Cross-browser testing done
- [ ] Error handling tested
- [ ] Edge cases covered

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

#### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

#### Setup
```bash
firebase init hosting
# Select "Don't overwrite" for existing files
# Public directory: dist
# Configure as single-page app: Yes
# Set up automatic builds: No
```

#### Environment Configuration
```bash
# Create .env.production
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_production_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
```

#### Build and Deploy
```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

#### Verify Deployment
```bash
# Your app will be at: https://<project-id>.web.app
# View deployment: firebase open hosting:site
```

### Option 2: Vercel

#### Prerequisites
```bash
npm install -g vercel
vercel login
```

#### Setup
```bash
cd project-directory
vercel
```

#### Environment Variables
```bash
# Add in Vercel Dashboard
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... add all variables
```

#### Deploy
```bash
# Deploy automatically on git push (recommended)
# Or deploy manually
vercel --prod
```

### Option 3: Netlify

#### Prerequisites
```bash
npm install -g netlify-cli
netlify login
```

#### Setup
```bash
netlify init
# Or drag and drop dist/ folder to Netlify Drop
```

#### Environment Variables
```bash
# Create netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_FIREBASE_API_KEY = "your_key"
  # ... add all variables
```

#### Deploy
```bash
netlify deploy --prod
```

## Production Optimization

### 1. Environment Variables
```javascript
// src/services/firebase.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### 2. Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});
```

### 3. Performance Headers
```javascript
// vite.config.js or firebase.json
{
  "headers": [
    {
      "source": "/dist/**",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/**",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 4. Redirects Configuration
```javascript
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Post-Deployment

### 1. Verify Deployment
- [ ] App loads without errors
- [ ] All pages accessible
- [ ] Authentication works
- [ ] Code analysis works
- [ ] History saves/loads
- [ ] Responsive design works
- [ ] Performance is acceptable

### 2. Monitor Performance
```javascript
// Add to main.jsx
import { reportWebVitals } from './utils/performance';

reportWebVitals();
```

### 3. Setup Analytics
```javascript
// src/services/firebase.js
import { getAnalytics } from "firebase/analytics";

export const analytics = getAnalytics(app);
```

### 4. Error Tracking
Add error tracking service:
```javascript
// Option 1: Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});

// Option 2: LogRocket
import LogRocket from 'logrocket';
LogRocket.init('your-app-id');
```

## Continuous Deployment

### GitHub Actions Workflow
File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          # ... add all secrets
      
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### GitHub Secrets Setup
```bash
# Add to GitHub repository Settings > Secrets
FIREBASE_TOKEN (get from: firebase login:ci)
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
# ... add all Firebase credentials
```

## Rollback Procedure

### Firebase Hosting Rollback
```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone <source-version> <target-version>
```

### Manual Rollback
```bash
# Deploy previous version
git checkout <previous-commit>
npm run build
firebase deploy
```

## Troubleshooting

### Issue: Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Firebase Auth Not Working
- Check Firebase rules in console
- Verify domain in allowed list
- Check environment variables

### Issue: Slow Performance
- Run: `npm run build && npm run preview`
- Check bundle size: `npm run build` and analyze dist
- Profile in Chrome DevTools

### Issue: 404 on Page Refresh
- Ensure SPA redirect rules configured
- For Firebase: check rewrites
- For Vercel/Netlify: check redirects

## Monitoring & Maintenance

### Daily Checks
- [ ] App accessible
- [ ] No error emails
- [ ] Performance metrics normal

### Weekly Checks
- [ ] Review error logs
- [ ] Check Firebase usage
- [ ] Monitor costs

### Monthly Reviews
- [ ] Performance trends
- [ ] Security updates
- [ ] Dependency updates
- [ ] User feedback

## SSL/TLS & Security

### Firebase Hosting
- SSL automatically enabled
- Free certificate via Let's Encrypt
- Automatic renewal

### Custom Domain
```bash
firebase hosting:domain:create
# Follow on-screen instructions
```

## Scaling Considerations

### Database Optimization
- Add Firestore indexes for common queries
- Implement data caching
- Archive old analyses

### Performance at Scale
- Consider lazy loading modules
- Implement pagination for large lists
- Add service worker for offline support

### Cost Management
- Monitor Firebase usage
- Set up billing alerts
- Optimize data storage

## Disaster Recovery

### Backup Strategy
```bash
# Export Firestore data
firebase firestore:export gs://backup-bucket/$(date +%Y%m%d)
```

### Recovery Procedure
```bash
# Restore from backup
firebase firestore:import gs://backup-bucket/2024MMDD/all_namespaces/all_kinds
```

## Post-Launch Roadmap

### Week 1
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Fix critical bugs

### Month 1
- [ ] Performance optimization
- [ ] Add analytics
- [ ] Plan new features

### Ongoing
- [ ] Regular updates
- [ ] Security patches
- [ ] Feature additions

---

**Document**: Deployment Guide
**Version**: 1.0.0
**Last Updated**: 2024
**Author**: Aman Pokhariya
