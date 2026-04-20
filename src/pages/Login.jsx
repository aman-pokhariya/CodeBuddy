import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, ErrorAlert, LoadingSpinner } from '../components';
import { validateEmail } from '../utils/helpers';
import { Mail, Lock, Code } from 'lucide-react';

/**
 * Login Page
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
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
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Login failed. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Logging in..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Code size={32} className="text-purple-500" />
          <h1 className="text-3xl font-bold text-white">CodeBuddy</h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-6">Sign in to your account to continue</p>

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
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="••••••••"
              error={errors.password}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
