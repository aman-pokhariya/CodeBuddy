import { useState, useEffect } from 'react';

/**
 * Responsive Design Utilities
 * Helper functions for responsive design patterns
 */

// Breakpoint definitions (in pixels)
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Custom hook to detect current breakpoint
 * @returns {string} - Current breakpoint name
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('md');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Check if screen is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < BREAKPOINTS.md);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

/**
 * Check if screen is tablet or larger
 */
export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= BREAKPOINTS.md && width < BREAKPOINTS.lg);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isTablet;
}

/**
 * Check if screen is desktop or larger
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= BREAKPOINTS.lg);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.lg);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
}

/**
 * Get responsive grid columns based on breakpoint
 */
export function getResponsiveGridCols(baseCount) {
  return {
    xs: Math.max(1, Math.floor(baseCount / 4)),
    sm: Math.max(1, Math.floor(baseCount / 2)),
    md: Math.max(1, Math.floor(baseCount * 0.75)),
    lg: baseCount
  };
}

/**
 * Get responsive font size based on breakpoint
 */
export function getResponsiveFontSize(baseSizeName) {
  const fontSizes = {
    xs: { sm: 'text-xs', md: 'text-sm', lg: 'text-base' },
    sm: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
    base: { sm: 'text-base', md: 'text-lg', lg: 'text-xl' },
    lg: { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' },
    xl: { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' },
    '2xl': { sm: 'text-2xl', md: 'text-3xl', lg: 'text-4xl' }
  };

  return fontSizes[baseSizeName] || fontSizes.base;
}

/**
 * Get responsive padding based on breakpoint
 */
export function getResponsivePadding(basePadding) {
  return {
    xs: `p-${Math.max(1, Math.floor(basePadding / 2))}`,
    sm: `p-${Math.max(1, Math.floor(basePadding * 0.75))}`,
    md: `p-${basePadding}`,
    lg: `p-${basePadding}`
  };
}

/**
 * Responsive image wrapper
 */
export function getResponsiveImageClasses() {
  return 'w-full h-auto object-cover';
}

/**
 * Responsive container max widths
 */
export function getContainerClasses(size = 'md') {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-xl'
  };
  return sizes[size] || sizes.md;
}

/**
 * Stack layout - responsive flex direction
 */
export function getStackClasses(variant = 'row') {
  const directions = {
    row: 'flex-row',
    column: 'flex-col',
    'responsive': 'flex-col md:flex-row' // Mobile: column, Desktop: row
  };
  return directions[variant] || directions.responsive;
}

/**
 * Responsive grid templates
 */
export const RESPONSIVE_GRID_TEMPLATES = {
  // Simple grids
  cols1: 'grid-cols-1',
  cols1to2: 'grid-cols-1 md:grid-cols-2',
  cols1to3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  cols1to4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  cols2to3: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  cols2to4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',

  // Layout templates
  sidebar: 'grid-cols-1 lg:grid-cols-3 gap-8',
  twoColumn: 'grid-cols-1 lg:grid-cols-2 gap-8',
  threeColumn: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
};

/**
 * Responsive gap/spacing
 */
export const RESPONSIVE_GAPS = {
  tight: 'gap-2 md:gap-4 lg:gap-6',
  normal: 'gap-4 md:gap-6 lg:gap-8',
  loose: 'gap-6 md:gap-8 lg:gap-10'
};

/**
 * Mobile-first responsive visibility
 */
export const RESPONSIVE_DISPLAY = {
  mobileOnly: 'block md:hidden',
  tabletUp: 'hidden md:block',
  desktopOnly: 'hidden lg:block'
};

export default {
  BREAKPOINTS,
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  getResponsiveGridCols,
  getResponsiveFontSize,
  getResponsivePadding,
  getResponsiveImageClasses,
  getContainerClasses,
  getStackClasses,
  RESPONSIVE_GRID_TEMPLATES,
  RESPONSIVE_GAPS,
  RESPONSIVE_DISPLAY
};
