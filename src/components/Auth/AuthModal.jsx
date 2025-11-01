import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-muted/50"
        >
          <Icon name="X" size={20} />
        </button>

        {/* Content */}
        <div className="p-6 pt-12">
          {mode === 'login' ? (
            <LoginForm 
              onToggleMode={handleToggleMode}
              onClose={onClose}
            />
          ) : (
            <SignupForm 
              onToggleMode={handleToggleMode}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AuthModal;