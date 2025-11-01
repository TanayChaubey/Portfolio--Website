import React from 'react';
import Icon from '../AppIcon';

const WorkflowProgress = ({ 
  currentPhase = 'template-selection', 
  saveStatus = 'saved',
  lastSaved = null 
}) => {
  const phases = [
    {
      id: 'template-selection',
      label: 'Template Selection',
      icon: 'Layout',
      description: 'Choose your portfolio design'
    },
    {
      id: 'content-creation',
      label: 'Content Creation',
      icon: 'Edit3',
      description: 'Add your portfolio content'
    },
    {
      id: 'customization',
      label: 'Customization',
      icon: 'Palette',
      description: 'Personalize your design'
    },
    {
      id: 'preview',
      label: 'Preview & Publish',
      icon: 'Eye',
      description: 'Review and share your portfolio'
    }
  ];

  const getCurrentPhaseIndex = () => {
    return phases?.findIndex(phase => phase?.id === currentPhase);
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Loader2';
      case 'saved':
        return 'Check';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Clock';
    }
  };

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'text-warning';
      case 'saved':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved';
    const now = new Date();
    const saved = new Date(lastSaved);
    const diffInMinutes = Math.floor((now - saved) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return saved?.toLocaleDateString();
  };

  const currentPhaseIndex = getCurrentPhaseIndex();

  return (
    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
      {/* Progress Indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {phases?.map((phase, index) => (
            <div key={phase?.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 ease-out ${
                  index <= currentPhaseIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-text-secondary'
                }`}
              >
                <Icon 
                  name={phase?.icon} 
                  size={16} 
                  color={index <= currentPhaseIndex ? 'white' : 'currentColor'}
                />
              </div>
              {index < phases?.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 transition-all duration-150 ease-out ${
                    index < currentPhaseIndex ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Current Phase Label */}
        <div className="hidden sm:block">
          <span className="text-sm font-medium text-text-primary">
            {phases?.[currentPhaseIndex]?.label}
          </span>
          <span className="text-xs text-text-secondary ml-2">
            {phases?.[currentPhaseIndex]?.description}
          </span>
        </div>
      </div>
      {/* Save Status */}
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 ${getSaveStatusColor()}`}>
          <Icon 
            name={getSaveStatusIcon()} 
            size={14} 
            className={saveStatus === 'saving' ? 'animate-spin' : ''}
          />
          <span className="text-xs font-medium">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved'}
            {saveStatus === 'error' && 'Error'}
            {saveStatus === 'pending' && 'Pending'}
          </span>
        </div>
        
        {saveStatus === 'saved' && lastSaved && (
          <span className="text-xs text-text-secondary">
            {formatLastSaved()}
          </span>
        )}
      </div>
    </div>
  );
};

export default WorkflowProgress;