import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for managing loading and error states
 * @returns {object} - Loading and error management object
 */
export function useLoadingState(initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const setErrorMsg = (err) => {
    setError(err);
    stopLoading();
  };
  const clearError = () => setError(null);

  return { loading, error, startLoading, stopLoading, setErrorMsg, clearError };
}

/**
 * Custom hook for managing form state
 * @param {object} initialValues - Initial form values
 * @param {function} onSubmit - Submit handler
 * @returns {object} - Form state and handlers
 */
export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  };
}

/**
 * Custom hook for local storage
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {array} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Custom hook to detect if component is mounted
 * @returns {object} - isMounted ref
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

/**
 * Custom hook for previous value
 * @param {any} value - Current value
 * @returns {any} - Previous value
 */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
