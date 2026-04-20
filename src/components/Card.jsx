import PropTypes from 'prop-types';

/**
 * Reusable Card Component
 */
const Card = ({
  children,
  className = '',
  hover = false,
  border = true,
  padding = 'p-6',
  ...props
}) => {
  const baseStyles = 'bg-gray-900 rounded-lg shadow-lg transition-all duration-200';
  const borderStyles = border ? 'border border-gray-800' : '';
  const hoverStyles = hover ? 'hover:shadow-2xl hover:border-purple-500' : '';
  const finalClassName = `${baseStyles} ${borderStyles} ${hoverStyles} ${padding} ${className}`;

  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  border: PropTypes.bool,
  padding: PropTypes.string
};

export default Card;
