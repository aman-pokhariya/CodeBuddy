/**
 * Utility functions for the application
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with strength score
 */
export const validatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const strengthLevel = strength <= 2 ? 'weak' : strength <= 3 ? 'medium' : 'strong';

  return {
    isValid: strength >= 3,
    strength: strengthLevel,
    checks
  };
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Highlight text with keywords
 * @param {string} text - Text to highlight
 * @param {string|array} keywords - Keywords to highlight
 * @returns {string}
 */
export const highlightKeywords = (text, keywords) => {
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
  let highlighted = text;

  keywordArray.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });

  return highlighted;
};

/**
 * Generate a unique ID
 * @returns {string}
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce a function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param {function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {function}
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string}
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get random color
 * @returns {string}
 */
export const getRandomColor = () => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default {
  validateEmail,
  validatePassword,
  formatDate,
  formatRelativeTime,
  truncateText,
  highlightKeywords,
  generateId,
  debounce,
  throttle,
  deepClone,
  getInitials,
  getRandomColor
};
