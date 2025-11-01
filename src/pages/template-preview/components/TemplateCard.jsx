import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TemplateCard = ({ template, onPreview, onUseTemplate }) => {
  const getStyleBadgeColor = (style) => {
    switch (style?.toLowerCase()) {
      case 'modern':
        return 'bg-blue-100 text-blue-800';
      case 'minimalist':
        return 'bg-gray-100 text-gray-800';
      case 'creative':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-green-100 text-green-800';
      case 'artistic':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      {/* Template Preview Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={template?.preview}
          alt={`${template?.name} template preview`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onPreview(template)}
              iconName="Eye"
              iconPosition="left"
              iconSize={16}
              className="bg-white/90 hover:bg-white text-text-primary border-white/20"
            >
              Preview
            </Button>
            <Button
              variant="default"
              onClick={() => onUseTemplate(template)}
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={16}
            >
              Use Template
            </Button>
          </div>
        </div>

        {/* Style Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStyleBadgeColor(template?.style)}`}>
            {template?.style}
          </span>
        </div>

        {/* Features Indicators */}
        <div className="absolute top-3 right-3 flex gap-1">
          {template?.responsive && (
            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
              <Icon name="Smartphone" size={12} className="text-success" />
            </div>
          )}
          {template?.customizable && (
            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
              <Icon name="Palette" size={12} className="text-primary" />
            </div>
          )}
        </div>
      </div>
      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors duration-200">
            {template?.name}
          </h3>
          <div className="flex items-center gap-1 text-warning">
            <Icon name="Star" size={14} className="fill-current" />
            <span className="text-sm font-medium">{template?.rating}</span>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
          {template?.description}
        </p>

        {/* Features List */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template?.features?.slice(0, 3)?.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-muted text-text-secondary rounded-md"
            >
              {feature}
            </span>
          ))}
          {template?.features?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-muted text-text-secondary rounded-md">
              +{template?.features?.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onPreview(template)}
            iconName="Eye"
            iconPosition="left"
            iconSize={14}
            className="flex-1"
          >
            Preview
          </Button>
          <Button
            variant="default"
            onClick={() => onUseTemplate(template)}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={14}
            className="flex-1"
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;