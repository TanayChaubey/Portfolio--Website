import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SignupForm = ({ onToggleMode, onClose }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData?.email, formData?.password, {
        userData: {
          full_name: formData?.fullName,
          role: 'user'
        }
      });
      
      setSuccess(true);
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (error) {
      setError(error?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Account Created!</h2>
          <p className="text-green-700 text-sm">
            Welcome to Portfolio Builder! You can now start creating your professional portfolio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Create Account</h2>
        <p className="text-text-secondary mt-2">Join Portfolio Builder today</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData?.password}
          onChange={handleChange}
          required
          disabled={loading}
          minLength={6}
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
          minLength={6}
        />

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-text-secondary text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-medium"
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;