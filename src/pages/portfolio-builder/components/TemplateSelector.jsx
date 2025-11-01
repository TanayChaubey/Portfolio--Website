import React, { useState, useEffect } from 'react';
import { TemplateService } from '../../../services/portfolioService';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await TemplateService?.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    const templateData = {
      id: template?.id,
      value: template?.name?.toLowerCase()?.replace(/\s+/g, '-'),
      label: template?.name,
      description: template?.description,
      category: template?.category,
      isPremium: template?.is_premium
    };
    
    onTemplateChange?.(templateData);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Choose Your Template
          </h3>
          <p className="text-text-secondary text-sm">
            Loading available templates...
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3]?.map(i => (
            <div key={i} className="bg-muted rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Failed to Load Templates
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            {error}
          </p>
          <Button
            onClick={loadTemplates}
            variant="default"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Choose Your Template
        </h3>
        <p className="text-text-secondary text-sm">
          Select a design that matches your professional style
        </p>
      </div>
      {/* Selected Template Display */}
      {selectedTemplate && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Check" size={20} className="text-primary" />
            <div>
              <h4 className="font-medium text-primary">{selectedTemplate?.label}</h4>
              <p className="text-sm text-primary/80">{selectedTemplate?.description}</p>
            </div>
          </div>
        </div>
      )}
      {/* Template Grid */}
      <div className="space-y-4">
        {templates?.map((template) => (
          <div
            key={template?.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-text-primary">{template?.name}</h4>
                  {template?.is_premium && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  {template?.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-text-secondary capitalize">
                    {template?.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {selectedTemplate?.id === template?.id && (
                  <Icon name="Check" size={20} className="text-primary" />
                )}
                <Button
                  variant={selectedTemplate?.id === template?.id ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleTemplateSelect(template);
                  }}
                >
                  {selectedTemplate?.id === template?.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>

            {/* Template Preview Placeholder */}
            <div className="mt-4 bg-muted/50 rounded-lg h-24 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Layout" size={24} className="text-text-secondary mx-auto mb-1" />
                <p className="text-xs text-text-secondary">Template Preview</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {templates?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Layout" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="font-medium text-text-primary mb-2">No Templates Available</h4>
          <p className="text-text-secondary text-sm">
            Templates will be loaded from your database
          </p>
        </div>
      )}
      {/* Template Categories Filter (Future Enhancement) */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-2">Coming Soon</h4>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• Template categories filter</li>
          <li>• Live template previews</li>
          <li>• Custom template uploads</li>
          <li>• Template customization</li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateSelector;