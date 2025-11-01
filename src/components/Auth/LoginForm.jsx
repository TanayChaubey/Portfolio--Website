import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm = ({ onToggleMode, onClose }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      onClose?.();
    } catch (error) {
      setError(error?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');

    try {
      await signIn(demoEmail, demoPassword);
      onClose?.();
    } catch (error) {
      setError(error?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Sign In</h2>
        <p className="text-text-secondary mt-2">Welcome back to Portfolio Builder</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e?.target?.value)}
          required
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e?.target?.value)}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Demo Credentials Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-3">Demo Credentials</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              <div className="font-medium">Admin Account</div>
              <div className="text-xs">admin@portfolio.com / admin123</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('admin@portfolio.com', 'admin123')}
              disabled={loading}
            >
              Use Admin
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              <div className="font-medium">User Account</div>
              <div className="text-xs">user@portfolio.com / user123</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('user@portfolio.com', 'user123')}
              disabled={loading}
            >
              Use User
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-text-secondary text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-medium"
            disabled={loading}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;