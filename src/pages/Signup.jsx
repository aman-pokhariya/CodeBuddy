import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, ErrorAlert, LoadingSpinner } from '../components';
import { validateEmail, validatePassword } from '../utils/helpers';
import { Mail, Lock, User, Code, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Signup Page
 */
function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordStrength(validation);
    if (errors.password) setErrors({ ...errors, password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signup(email, password, displayName);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Signup failed. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Creating your account..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Code size={32} className="text-purple-500" />
          <h1 className="text-3xl font-bold text-white">CodeBuddy</h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400 mb-6">Join the CodeBuddy community today</p>

        {/* Error Alert */}
        {apiError && (
          <ErrorAlert
            message={apiError}
            onClose={() => setApiError('')}
            dismissible
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2 flex items-center gap-2">
              <User size={16} />
              Display Name
            </label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (errors.displayName) setErrors({ ...errors, displayName: '' });
              }}
              placeholder="John Doe"
              error={errors.displayName}
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="your@email.com"
              error={errors.email}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2 flex items-center gap-2">
              <Lock size={16} />
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              disabled={loading}
            />
            
            {/* Password Strength Indicator */}
            {passwordStrength && password && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {['length', 'uppercase', 'lowercase', 'numbers'].map(check => (
                    <div
                      key={check}
                      className={`flex-1 h-1 rounded ${passwordStrength.checks[check] ? 'bg-green-500' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Strength: <span className={`font-semibold ${
                    passwordStrength.strength === 'strong' ? 'text-green-400' :
                    passwordStrength.strength === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2 flex items-center gap-2">
              <Lock size={16} />
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              placeholder="••••••••"
              error={errors.confirmPassword}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Signup;
