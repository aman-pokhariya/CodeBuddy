/**
 * Performance Monitoring & Optimization Utilities
 */

// Store metrics
const metrics = {};

/**
 * Start measuring performance
 * @param {string} label - Label for the measurement
 */
export function startMeasure(label) {
  if (!metrics[label]) {
    metrics[label] = [];
  }
  
  const mark = `${label}-start-${Date.now()}`;
  performance.mark(mark);
  metrics[label].push({ mark, startTime: performance.now() });
}

/**
 * End measuring performance
 * @param {string} label - Label for the measurement
 */
export function endMeasure(label) {
  if (!metrics[label] || metrics[label].length === 0) {
    console.warn(`No start mark found for ${label}`);
    return null;
  }

  const metric = metrics[label].pop();
  const endTime = performance.now();
  const duration = endTime - metric.startTime;

  if (process.env.NODE_ENV === 'development') {
    console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
  }

  return duration;
}

/**
 * Measure a function execution
 * @param {string} label - Label for the measurement
 * @param {function} fn - Function to measure
 * @returns {any} - Function result
 */
export function measure(label, fn) {
  startMeasure(label);
  const result = fn();
  endMeasure(label);
  return result;
}

/**
 * Measure async function execution
 * @param {string} label - Label for the measurement
 * @param {function} fn - Async function to measure
 * @returns {Promise} - Promise that resolves to function result
 */
export async function measureAsync(label, fn) {
  startMeasure(label);
  const result = await fn();
  endMeasure(label);
  return result;
}

/**
 * Get all performance metrics
 * @returns {object} - All collected metrics
 */
export function getMetrics() {
  return metrics;
}

/**
 * Clear all metrics
 */
export function clearMetrics() {
  Object.keys(metrics).forEach(key => delete metrics[key]);
}

/**
 * Report Core Web Vitals
 */
export function reportWebVitals() {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime, 'ms');
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (err) {
      console.error('Error observing LCP:', err);
    }
  }

  // First Input Delay (FID)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          console.log('📊 FID:', entry.processingDuration, 'ms');
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (err) {
      console.error('Error observing FID:', err);
    }
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('📊 CLS:', clsValue);
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (err) {
      console.error('Error observing CLS:', err);
    }
  }
}

/**
 * Log component render time (for development)
 * @param {string} componentName - Name of the component
 */
export function logRenderTime(componentName) {
  if (process.env.NODE_ENV === 'development') {
    return (Component) => {
      return (props) => {
        const start = performance.now();
        const element = Component(props);
        const end = performance.now();
        console.log(`🎨 Rendered ${componentName} in ${(end - start).toFixed(2)}ms`);
        return element;
      };
    };
  }
  return (Component) => Component;
}

/**
 * Debounce with performance tracking
 * @param {function} func - Function to debounce
 * @param {number} wait - Debounce wait time
 * @param {string} label - Optional label for tracking
 * @returns {function} - Debounced function
 */
export function debounceWithTracking(func, wait, label) {
  let timeout;
  let callCount = 0;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      callCount++;
      if (label && process.env.NODE_ENV === 'development') {
        console.log(`🔄 Debounced ${label} (called ${callCount} times)`);
      }
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Memoize a function with cache stats
 * @param {function} func - Function to memoize
 * @returns {object} - Memoized function and cache stats
 */
export function memoizeWithStats(func) {
  const cache = new Map();
  let hits = 0;
  let misses = 0;

  const memoized = (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      hits++;
      return cache.get(key);
    }

    misses++;
    const result = func(...args);
    cache.set(key, result);

    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 Cache - Hits: ${hits}, Misses: ${misses}, Hit Rate: ${(hits / (hits + misses) * 100).toFixed(1)}%`);
    }

    return result;
  };

  return {
    memoized,
    getStats: () => ({ hits, misses, hitRate: (hits / (hits + misses) * 100).toFixed(1) }),
    clearCache: () => {
      cache.clear();
      hits = 0;
      misses = 0;
    }
  };
}

/**
 * Detect and report performance issues
 */
export function detectPerformanceIssues() {
  if (process.env.NODE_ENV !== 'development') return;

  // Check for unnecessary re-renders
  const observer = {
    reportMissedGarbageCollection: () => {
      console.warn('⚠️  Possible memory leak detected');
    },

    checkLargeBundle: () => {
      if (performance.getEntriesByType('navigation')[0]?.transferSize > 500000) {
        console.warn('⚠️  Large bundle detected (> 500KB)');
      }
    },

    checkSlowTransaction: () => {
      performance.getEntriesByType('measure').forEach((entry) => {
        if (entry.duration > 1000) {
          console.warn(`⚠️  Slow transaction: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      });
    }
  };

  observer.checkLargeBundle();
  observer.checkSlowTransaction();

  return observer;
}

export default {
  startMeasure,
  endMeasure,
  measure,
  measureAsync,
  getMetrics,
  clearMetrics,
  reportWebVitals,
  logRenderTime,
  debounceWithTracking,
  memoizeWithStats,
  detectPerformanceIssues
};
