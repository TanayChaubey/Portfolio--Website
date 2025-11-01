import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SaveManager = ({ portfolio, onSave, saveStatus, lastSaved, user, onSignIn }) => {
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  const handleSave = () => {
    onSave?.(false); // Manual save
  };

  const handleAutoSaveToggle = () => {
    setIsAutoSaveEnabled(!isAutoSaveEnabled);
  };

  const formatLastSaved = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    return date?.toLocaleDateString();
  };

  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          icon: 'Loader',
          text: 'Saving...',
          className: 'text-blue-600 animate-spin'
        };
      case 'saved':
        return {
          icon: 'Check',
          text: 'Saved',
          className: 'text-green-600'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          text: 'Save failed',
          className: 'text-red-600'
        };
      default:
        return {
          icon: 'Save',
          text: 'Not saved',
          className: 'text-text-secondary'
        };
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Icon name="Lock" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Sign in to Save Your Work
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            Create an account to save your portfolio, publish it online, and access it from anywhere.
          </p>
          
          <Button
            onClick={onSignIn}
            variant="default"
            size="lg"
            iconName="LogIn"
            iconPosition="left"
            iconSize={16}
            className="w-full"
          >
            Sign In to Save
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-text-primary mb-2">Preview Mode Features</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• View portfolio templates</li>
            <li>• Edit profile information</li>
            <li>• Customize sections and design</li>
            <li>• Preview your portfolio</li>
          </ul>
        </div>

        <div className="bg-primary/10 rounded-lg p-4">
          <h4 className="font-medium text-primary mb-2">Pro Features (Sign in required)</h4>
          <ul className="text-sm text-primary space-y-1">
            <li>• Save and restore your work</li>
            <li>• Publish portfolio online</li>
            <li>• Custom domain support</li>
            <li>• SEO optimization</li>
            <li>• Analytics and insights</li>
          </ul>
        </div>
      </div>
    );
  }

  const statusDisplay = getSaveStatusDisplay();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Save Your Portfolio
        </h3>
      </div>

      {/* Save Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-primary">Save Status</span>
          <div className="flex items-center space-x-2">
            <Icon 
              name={statusDisplay?.icon} 
              size={16} 
              className={statusDisplay?.className}
            />
            <span className={`text-sm ${statusDisplay?.className}`}>
              {statusDisplay?.text}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-text-secondary">
          Last saved: {formatLastSaved(lastSaved)}
        </div>
      </div>

      {/* Manual Save Button */}
      <Button
        onClick={handleSave}
        disabled={saveStatus === 'saving'}
        variant="default"
        size="lg"
        iconName="Save"
        iconPosition="left"
        iconSize={16}
        className="w-full"
      >
        {saveStatus === 'saving' ? 'Saving...' : 'Save Portfolio'}
      </Button>

      {/* Auto-save Toggle */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-text-primary">Auto-save</h4>
            <p className="text-sm text-text-secondary">
              Automatically save changes as you work
            </p>
          </div>
          <button
            onClick={handleAutoSaveToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isAutoSaveEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAutoSaveEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Portfolio Info */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-2">Portfolio Details</h4>
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex justify-between">
            <span>Profile sections:</span>
            <span>{portfolio?.sections?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Template:</span>
            <span>{portfolio?.template?.label || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-orange-600">Draft</span>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-text-primary">Export Options</h4>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          iconSize={14}
          className="w-full"
          disabled
        >
          Download as PDF (Coming Soon)
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Code"
          iconPosition="left"
          iconSize={14}
          className="w-full"
          disabled
        >
          Export HTML (Coming Soon)
        </Button>
      </div>

      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-600" />
            <p className="text-red-700 text-sm">
              Failed to save your portfolio. Please try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveManager;