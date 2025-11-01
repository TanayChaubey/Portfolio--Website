import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TemplateModal = ({ isOpen, template, templates, onClose, onUseTemplate, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (template && templates) {
      const index = templates?.findIndex(t => t?.id === template?.id);
      setCurrentIndex(index);
    }
  }, [template, templates]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e?.key === 'Escape') {
        onClose();
      } else if (e?.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e?.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onNavigate(templates?.[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < templates?.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onNavigate(templates?.[newIndex]);
    }
  };

  const currentTemplate = templates?.[currentIndex] || template;

  if (!isOpen || !currentTemplate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">{currentTemplate?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  currentTemplate?.style === 'Modern' ? 'bg-blue-100 text-blue-800' :
                  currentTemplate?.style === 'Minimalist' ? 'bg-gray-100 text-gray-800' :
                  currentTemplate?.style === 'Creative' ? 'bg-purple-100 text-purple-800' :
                  currentTemplate?.style === 'Professional'? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {currentTemplate?.style}
                </span>
                <div className="flex items-center gap-1 text-warning">
                  <Icon name="Star" size={14} className="fill-current" />
                  <span className="text-sm font-medium">{currentTemplate?.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              iconName="ChevronLeft"
              iconSize={20}
              className="w-10 h-10"
            />
            <span className="text-sm text-text-secondary px-2">
              {currentIndex + 1} of {templates?.length || 1}
            </span>
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={currentIndex === (templates?.length || 1) - 1}
              iconName="ChevronRight"
              iconSize={20}
              className="w-10 h-10"
            />
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <Button
              variant="ghost"
              onClick={onClose}
              iconName="X"
              iconSize={20}
              className="w-10 h-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(95vh-140px)]">
          {/* Template Preview */}
          <div className="flex-1 bg-muted/20 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={currentTemplate?.preview}
                alt={`${currentTemplate?.name} detailed preview`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Template Details */}
          <div className="lg:w-80 border-l border-border bg-surface overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-text-primary mb-2">Description</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {currentTemplate?.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-text-primary mb-3">Features</h3>
                <div className="space-y-2">
                  {currentTemplate?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-text-primary mb-3">Compatibility</h3>
                <div className="flex gap-2">
                  {currentTemplate?.responsive && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-success/10 text-success rounded-lg">
                      <Icon name="Smartphone" size={16} />
                      <span className="text-sm font-medium">Responsive</span>
                    </div>
                  )}
                  {currentTemplate?.customizable && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                      <Icon name="Palette" size={16} />
                      <span className="text-sm font-medium">Customizable</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Content Preview */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-text-primary mb-3">Sample Content</h3>
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <div className="mb-3">
                    <div className="font-medium text-text-primary">John Doe</div>
                    <div className="text-text-secondary">Full Stack Developer</div>
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed">
                    Passionate developer with 5+ years of experience building scalable web applications using modern technologies...
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="default"
                  onClick={() => onUseTemplate(currentTemplate)}
                  iconName="ArrowRight"
                  iconPosition="right"
                  iconSize={16}
                  fullWidth
                >
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                >
                  Continue Browsing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;