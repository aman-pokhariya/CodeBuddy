# RESPONSIVE-DESIGN.md - Responsive Design Guide

## Overview

CodeBuddy uses a mobile-first responsive design approach with Tailwind CSS breakpoints to ensure excellent user experience across all devices.

## Device Breakpoints

```
xs (extra small)  - 0px and up       [Phones, portrait phones]
sm (small)        - 640px and up     [Landscape phones, small tablets]
md (medium)       - 768px and up     [Tablets, hybrid devices]
lg (large)        - 1024px and up    [Desktops, large tablets]
xl (extra large)  - 1280px and up    [Large desktops]
2xl               - 1536px and up    [Extra large desktops]
```

## Responsive Design Strategy

### 1. Mobile-First Approach
- Design for mobile first
- Add features as screen size increases
- Use min-width media queries (natural with Tailwind)

```html
<!-- Stack on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/2">Left</div>
  <div class="w-full md:w-1/2">Right</div>
</div>
```

### 2. Responsive Grid System
CodeBuddy uses consistent grid patterns:

#### Single Column (Mobile)
```jsx
<div className="grid grid-cols-1">
  {/* Single column on mobile */}
</div>
```

#### Two Column (Tablet+)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2">
  {/* 1 column mobile, 2 columns tablet+ */}
</div>
```

#### Three Column (Desktop+)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column mobile, 2 columns tablet, 3 columns desktop */}
</div>
```

#### Four Column (Large Desktop+)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 column mobile, 2 columns tablet, 4 columns desktop */}
</div>
```

## Page-Specific Responsive Patterns

### Dashboard Page

#### Stats Grid
```
Mobile:  1 column
Tablet:  2 columns
Desktop: 4 columns
```

**Implementation:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard />
  {/* ... */}
</div>
```

#### Main Content Layout
```
Mobile:  Single column (chart, then recent activity, then sidebar)
Tablet:  Single column (same as mobile)
Desktop: Two columns (chart on left, sidebar on right)
```

**Implementation:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    {/* Charts column */}
  </div>
  <div>
    {/* Sidebar column */}
  </div>
</div>
```

### Analyzer Page

#### Editor Layout
```
Mobile:  Single column (editor on top, results below)
Tablet:  Single column (same as mobile)
Desktop: Two columns (editor on left, results on right)
```

**Implementation:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div>
    {/* Code editor */}
  </div>
  <div>
    {/* Analysis results */}
  </div>
</div>
```

### History Page

#### List Layout
```
Mobile:  Vertical stack, full width cards
Tablet:  Grid 2 columns
Desktop: Grid 3-4 columns
```

**Implementation:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <AnalysisCard />
  {/* ... */}
</div>
```

## Common Responsive Patterns

### Padding & Spacing

```jsx
// Responsive padding - smaller on mobile, larger on desktop
<div className="px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
  Content with responsive padding
</div>

// Responsive gap - tight on mobile, wider on desktop
<div className="flex gap-2 md:gap-4 lg:gap-6">
  Items with responsive spacing
</div>
```

### Typography

```jsx
// Responsive font sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Large heading gets larger on bigger screens
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Body text scales responsively
</p>
```

### Visibility

```jsx
// Show only on mobile
<div className="block md:hidden">
  Mobile-only content
</div>

// Show on tablet and up
<div className="hidden md:block">
  Tablet and desktop content
</div>

// Show only on desktop
<div className="hidden lg:block">
  Desktop-only content
</div>
```

### Flexbox Stacking

```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Left item</div>
  <div className="flex-1">Right item</div>
</div>

// Full width on mobile, half on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

## Responsive Utilities

CodeBuddy provides custom responsive utilities in `src/utils/responsive.js`:

### Custom Hooks

#### useBreakpoint
```javascript
const breakpoint = useBreakpoint(); // Returns 'sm', 'md', 'lg', etc.
if (breakpoint === 'md') {
  // Do something on medium screens
}
```

#### useIsMobile
```javascript
const isMobile = useIsMobile(); // true if < 768px
if (isMobile) {
  // Show mobile-specific UI
}
```

#### useIsTablet
```javascript
const isTablet = useIsTablet(); // true if 768px - 1024px
```

#### useIsDesktop
```javascript
const isDesktop = useIsDesktop(); // true if >= 1024px
```

### Responsive Helpers

#### getResponsiveGridCols
```javascript
const cols = getResponsiveGridCols(4);
// { xs: 1, sm: 2, md: 3, lg: 4 }
```

#### RESPONSIVE_GRID_TEMPLATES
```javascript
import { RESPONSIVE_GRID_TEMPLATES } from '../utils/responsive';

<div className={`grid ${RESPONSIVE_GRID_TEMPLATES.cols1to3} gap-4`}>
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

#### RESPONSIVE_GAPS
```javascript
<div className={`flex gap-2 md:gap-4 ${RESPONSIVE_GAPS.normal}`}>
  Items with responsive gaps
</div>
```

#### RESPONSIVE_DISPLAY
```javascript
<div className={RESPONSIVE_DISPLAY.mobileOnly}>
  {/* Only visible on mobile */}
</div>
```

## Navigation

### Desktop Navigation
- Horizontal navbar with links
- Logo + menu items + user profile
- Full width

### Mobile Navigation
- Hamburger menu icon
- Collapse to mobile menu
- Navigation drawer or dropdown

**Implementation in Navbar.jsx:**
```jsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

return (
  <nav>
    {/* Desktop nav - hidden on mobile */}
    <div className="hidden md:block">
      {/* Desktop menu */}
    </div>

    {/* Mobile menu toggle */}
    <button className="md:hidden">
      <Menu />
    </button>

    {/* Mobile menu - shown when open */}
    {mobileMenuOpen && (
      <div className="md:hidden">
        {/* Mobile menu content */}
      </div>
    )}
  </nav>
);
```

## Form Responsiveness

### Input Fields

```jsx
// Full width on mobile, constrained on desktop
<div className="w-full md:w-96">
  <Input 
    placeholder="Email"
    className="w-full"
  />
</div>

// Responsive form grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input placeholder="First Name" />
  <Input placeholder="Last Name" />
</div>
```

## Modal Responsiveness

```jsx
// Full screen on mobile, centered on desktop
<Modal
  className="w-full md:w-96 max-h-screen md:max-h-auto mx-4 md:mx-0"
>
  Modal content scales responsively
</Modal>
```

## Image Responsiveness

```jsx
// Responsive image
<img
  src="image.jpg"
  alt="Description"
  className="w-full h-auto object-cover"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  srcSet="image-small.jpg 640w,
          image-medium.jpg 1024w,
          image-large.jpg 1536w"
/>
```

## Container Queries (Future)

```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

## Testing Responsive Design

### Chrome DevTools
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test interactions at each breakpoint

### Manual Testing Devices
- **Mobile**: iPhone SE (375px), iPhone 12 (390px), Pixel 5 (393px)
- **Tablet**: iPad (768px), iPad Pro (1024px)
- **Desktop**: 1366px, 1920px, 2560px

### Responsive Testing Checklist
- [ ] Text is readable at all sizes
- [ ] Touch targets are >= 44px on mobile
- [ ] Images scale without distortion
- [ ] No horizontal scrolling on mobile
- [ ] Navigation works on all sizes
- [ ] Forms are usable on mobile
- [ ] Performance is good on slow connections
- [ ] Animations work smoothly
- [ ] Colors and contrast are maintained

## Performance Considerations

### Mobile Performance
- Minimize JavaScript
- Defer non-critical CSS
- Lazy load images
- Reduce bundle size
- Optimize network requests

### Code Splitting by Device
```javascript
// Load analytics only on desktop
if (useIsDesktop()) {
  const Analytics = lazy(() => import('./Analytics'));
}
```

## Common Issues & Solutions

### Issue: Text too small on mobile
**Solution:** Use responsive text sizes
```jsx
<h1 className="text-xl md:text-2xl lg:text-3xl">Heading</h1>
```

### Issue: Buttons too hard to tap on mobile
**Solution:** Ensure minimum touch target (44px)
```jsx
<Button className="h-12 px-4 md:h-10">
  Touch-friendly button
</Button>
```

### Issue: Images not loading on mobile
**Solution:** Use srcSet and sizes attributes
```jsx
<img 
  src="small.jpg"
  srcSet="small.jpg 640w, large.jpg 1280w"
  sizes="(max-width: 640px) 100vw, 50vw"
/>
```

### Issue: Sidebar hidden on tablet
**Solution:** Use correct breakpoints
```jsx
<div className="hidden lg:block">
  {/* Visible only on large screens */}
</div>
```

## Best Practices

1. **Mobile First**: Start with mobile design, enhance for larger screens
2. **Progressive Enhancement**: Add features as space allows
3. **Content Priority**: Show most important content first on mobile
4. **Touch-Friendly**: Use 44px minimum for touch targets
5. **Performance**: Optimize for slow mobile networks
6. **Testing**: Test on real devices, not just browser emulation
7. **Accessibility**: Ensure keyboard navigation works
8. **Consistency**: Use breakpoints consistently across pages

## Responsive Components Library

Reusable patterns for common responsive scenarios:

### Responsive Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
</div>
```

### Responsive Hero Section
```jsx
<div className="py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-2xl md:text-4xl lg:text-5xl">Hero Title</h1>
  </div>
</div>
```

### Responsive Two Column Layout
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <aside>Sidebar</aside>
  <main>Main content</main>
</div>
```

---

**Document**: Responsive Design Guide
**Version**: 1.0.0
**Last Updated**: 2024
**Author**: Aman Pokhariya
