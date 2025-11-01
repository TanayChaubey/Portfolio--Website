import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const DesignCustomizer = ({ design, onDesignChange }) => {
  const fontFamilies = [
    { value: 'Inter', label: 'Inter (Default)' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Nunito', label: 'Nunito' }
  ];

  const primaryColors = [
    { value: '#3b82f6', label: 'Blue (Default)', color: '#3b82f6' },
    { value: '#10b981', label: 'Emerald', color: '#10b981' },
    { value: '#8b5cf6', label: 'Purple', color: '#8b5cf6' },
    { value: '#f59e0b', label: 'Amber', color: '#f59e0b' },
    { value: '#ef4444', label: 'Red', color: '#ef4444' },
    { value: '#06b6d4', label: 'Cyan', color: '#06b6d4' },
    { value: '#84cc16', label: 'Lime', color: '#84cc16' },
    { value: '#f97316', label: 'Orange', color: '#f97316' },
    { value: '#ec4899', label: 'Pink', color: '#ec4899' },
    { value: '#6366f1', label: 'Indigo', color: '#6366f1' }
  ];

  const handleFontChange = (fontFamily) => {
    onDesignChange({
      ...design,
      fontFamily
    });
  };

  const handleColorChange = (primaryColor) => {
    onDesignChange({
      ...design,
      primaryColor
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="Palette" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Design Customization</h3>
      </div>
      {/* Font Family Selection */}
      <div className="space-y-3">
        <Select
          label="Font Family"
          description="Choose the typography for your portfolio"
          options={fontFamilies}
          value={design?.fontFamily || 'Inter'}
          onChange={handleFontChange}
        />
        
        <div className="bg-muted/30 rounded-lg p-3">
          <p 
            className="text-text-primary"
            style={{ fontFamily: design?.fontFamily || 'Inter' }}
          >
            Sample text with {design?.fontFamily || 'Inter'} font family. This is how your portfolio text will appear.
          </p>
        </div>
      </div>
      {/* Primary Color Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Primary Color
        </label>
        <p className="text-sm text-text-secondary">
          Choose the accent color for buttons, links, and highlights
        </p>
        
        <div className="grid grid-cols-5 gap-3">
          {primaryColors?.map((colorOption) => (
            <button
              key={colorOption?.value}
              onClick={() => handleColorChange(colorOption?.value)}
              className={`relative w-full aspect-square rounded-lg border-2 transition-all duration-150 hover:scale-105 ${
                design?.primaryColor === colorOption?.value
                  ? 'border-text-primary shadow-lg'
                  : 'border-border hover:border-text-secondary'
              }`}
              style={{ backgroundColor: colorOption?.color }}
              title={colorOption?.label}
            >
              {design?.primaryColor === colorOption?.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="Check" size={16} color="white" />
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: design?.primaryColor || '#3b82f6' }}
            />
            <span className="text-sm text-text-primary">
              Selected: {primaryColors?.find(c => c?.value === design?.primaryColor)?.label || 'Blue (Default)'}
            </span>
          </div>
        </div>
      </div>
      {/* Design Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Design Preview
        </label>
        
        <div 
          className="bg-card border border-border rounded-lg p-4 space-y-3"
          style={{ fontFamily: design?.fontFamily || 'Inter' }}
        >
          <h4 className="text-lg font-semibold text-text-primary">
            Your Name
          </h4>
          <p className="text-text-secondary">
            Software Developer
          </p>
          <button
            className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-150 hover:opacity-90"
            style={{ backgroundColor: design?.primaryColor || '#3b82f6' }}
          >
            Contact Me
          </button>
          <div className="flex space-x-2">
            <span 
              className="px-2 py-1 text-sm rounded-md"
              style={{ 
                backgroundColor: `${design?.primaryColor || '#3b82f6'}20`,
                color: design?.primaryColor || '#3b82f6'
              }}
            >
              React
            </span>
            <span 
              className="px-2 py-1 text-sm rounded-md"
              style={{ 
                backgroundColor: `${design?.primaryColor || '#3b82f6'}20`,
                color: design?.primaryColor || '#3b82f6'
              }}
            >
              JavaScript
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCustomizer;