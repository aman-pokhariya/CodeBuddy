import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Modal Component
 */
const Modal = ({ isOpen, title, children, onClose, size = 'md', closeButton = true }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 border border-gray-800 rounded-lg shadow-2xl ${sizes[size]} w-full animate-fade-in`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeButton: PropTypes.bool
};

export default Modal;
