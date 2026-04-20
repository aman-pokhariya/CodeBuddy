import PropTypes from 'prop-types';

/**
 * Badge Component
 */
const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const baseStyles = 'font-medium rounded-full inline-block whitespace-nowrap';
  
  const variants = {
    default: 'bg-gray-700 text-gray-100',
    primary: 'bg-purple-600 text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const finalClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return <span className={finalClassName}>{children}</span>;
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'error', 'warning', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Badge;
