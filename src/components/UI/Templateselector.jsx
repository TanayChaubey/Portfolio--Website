import React, { useState } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const TemplateSelector = ({ 
  isOpen = false, 
  onClose, 
  onTemplateSelect, 
  currentTemplate = null,
  templates = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultTemplates = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'professional',
      preview: '/assets/images/templates/modern-minimal.jpg',
      description: 'Clean and professional design perfect for corporate portfolios',
      features: ['Responsive', 'Dark Mode', 'Animation']
    },
    {
      id: 'creative-showcase',
      name: 'Creative Showcase',
      category: 'creative',
      preview: '/assets/images/templates/creative-showcase.jpg',
      description: 'Bold and vibrant template for creative professionals',
      features: ['Gallery Focus', 'Interactive', 'Mobile First']
    },
    {
      id: 'developer-portfolio',
      name: 'Developer Portfolio',
      category: 'technical',
      preview: '/assets/images/templates/developer-portfolio.jpg',
      description: 'Technical-focused template with code highlighting',
      features: ['Code Blocks', 'GitHub Integration', 'Project Showcase']
    },
    {
      id: 'business-executive',
      name: 'Business Executive',
      category: 'professional',
      preview: '/assets/images/templates/business-executive.jpg',
      description: 'Sophisticated template for business professionals',
      features: ['Timeline', 'Testimonials', 'Contact Forms']
    },
    {
      id: 'artistic-portfolio',
      name: 'Artistic Portfolio',
      category: 'creative',
      preview: '/assets/images/templates/artistic-portfolio.jpg',
      description: 'Expressive design for artists and designers',
      features: ['Full Screen Gallery', 'Video Support', 'Custom Layouts']
    },
    {
      id: 'startup-founder',
      name: 'Startup Founder',
      category: 'business',
      preview: '/assets/images/templates/startup-founder.jpg',
      description: 'Dynamic template for entrepreneurs and startup founders',
      features: ['Metrics Display', 'Team Section', 'Investor Ready']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Templates', icon: 'Grid' },
    { id: 'professional', label: 'Professional', icon: 'Briefcase' },
    { id: 'creative', label: 'Creative', icon: 'Palette' },
    { id: 'technical', label: 'Technical', icon: 'Code' },
    { id: 'business', label: 'Business', icon: 'TrendingUp' }
  ];

  const templateData = templates?.length > 0 ? templates : defaultTemplates;

  const filteredTemplates = templateData?.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (template) => {
    onTemplateSelect?.(template);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Choose Template</h2>
            <p className="text-text-secondary mt-1">Select a template to start building your portfolio</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Search and Categories */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
              {categories?.map((category) => (
                <Button
                  key={category?.id}
                  variant={selectedCategory === category?.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category?.id)}
                  iconName={category?.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="whitespace-nowrap"
                >
                  {category?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates?.map((template) => (
              <div
                key={template?.id}
                className={`group relative bg-card rounded-lg border-2 transition-all duration-150 ease-out cursor-pointer hover:shadow-lg hover:scale-105 ${
                  currentTemplate?.id === template?.id
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                {/* Template Preview */}
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                  <Image
                    src={template?.preview}
                    alt={template?.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors duration-150">
                      {template?.name}
                    </h3>
                    {currentTemplate?.id === template?.id && (
                      <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                        <Icon name="Check" size={14} color="white" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {template?.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {template?.features?.slice(0, 3)?.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-muted text-text-secondary rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-lg flex items-center justify-center">
                  <Button
                    variant="default"
                    iconName="Eye"
                    iconPosition="left"
                    iconSize={16}
                    className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-150"
                  >
                    Select Template
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No templates found</h3>
              <p className="text-text-secondary">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-text-secondary">
            {filteredTemplates?.length} template{filteredTemplates?.length !== 1 ? 's' : ''} available
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentTemplate && (
              <Button 
                variant="default"
                onClick={() => handleTemplateSelect(currentTemplate)}
                iconName="ArrowRight"
                iconPosition="right"
              >
                Continue with {currentTemplate?.name}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;