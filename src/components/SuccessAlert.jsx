import PropTypes from 'prop-types';
import { X, CheckCircle } from 'lucide-react';

/**
 * Success Alert Component
 */
const SuccessAlert = ({ message, onClose, dismissible = true }) => {
  if (!message) return null;

  return (
    <div className="bg-green-900 bg-opacity-20 border border-green-500 text-green-200 px-4 py-3 rounded-lg flex items-center justify-between animate-slide-in">
      <div className="flex items-center gap-3">
        <CheckCircle size={20} />
        <span>{message}</span>
      </div>
      {dismissible && (
        <button
          onClick={onClose}
          className="text-green-400 hover:text-green-300 transition-colors"
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

SuccessAlert.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool
};

export default SuccessAlert;
