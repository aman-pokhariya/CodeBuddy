import PropTypes from 'prop-types';

/**
 * Reusable Input Component
 */
const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  name,
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const baseInputStyles = 'w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed';
  
  const borderStyles = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-700 focus:border-purple-500';

  const finalInputClassName = `${baseInputStyles} ${borderStyles} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-100 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={finalInputClassName}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string
};

export default Input;
