import { memo } from 'react';

/**
 * Create a memoized component with display name
 * @param {function} Component - Component to memoize
 * @param {function} arePropsEqual - Custom comparison function
 * @returns {function} - Memoized component
 */
export function createMemoComponent(Component, arePropsEqual) {
  const MemoComponent = memo(Component, arePropsEqual);
  MemoComponent.displayName = Component.displayName || Component.name || 'MemoComponent';
  return MemoComponent;
}

/**
 * Custom hook to track re-renders in development
 */
export function useTraceUpdate(props) {
  const prev = React.useRef();

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const changedProps = {};

      Object.keys(props).forEach((key) => {
        if (prev.current) {
          if (prev.current[key] !== props[key]) {
            changedProps[key] = {
              from: prev.current[key],
              to: props[key]
            };
          }
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[Changed props]', changedProps);
      }

      prev.current = props;
    }
  }, [props]);
}

/**
 * HOC to wrap component with React.lazy and error boundary
 */
export function withLazyLoading(LazyComponent, fallback) {
  return (props) => (
    <React.Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
}

/**
 * Optimize list rendering with key generation
 * @param {array} items - List items
 * @param {function} keyFn - Key generation function
 * @returns {function} - Function to render items efficiently
 */
export function createOptimizedListRenderer(items, keyFn) {
  return (renderFn) => {
    return items.map((item, index) => (
      <React.Fragment key={keyFn(item, index)}>
        {renderFn(item, index)}
      </React.Fragment>
    ));
  };
}

export default {
  createMemoComponent,
  useTraceUpdate,
  withLazyLoading,
  createOptimizedListRenderer
};
