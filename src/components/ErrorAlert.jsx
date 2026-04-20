import PropTypes from 'prop-types';
import { X, AlertCircle } from 'lucide-react';

/**
 * Error Alert Component
 */
const ErrorAlert = ({ message, onClose, dismissible = true }) => {
  if (!message) return null;

  return (
    <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between animate-slide-in">
      <div className="flex items-center gap-3">
        <AlertCircle size={20} />
        <span>{message}</span>
      </div>
      {dismissible && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition-colors"
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool
};

export default ErrorAlert;
