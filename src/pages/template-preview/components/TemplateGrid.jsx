import React from 'react';
import Icon from '../../../components/AppIcon';
import TemplateCard from './TemplateCard';

const TemplateGrid = ({ templates, onPreview, onUseTemplate, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 })?.map((_, index) => (
          <div key={index} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <div className="p-4">
              <div className="h-6 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded mb-3 w-3/4" />
              <div className="flex gap-1 mb-4">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-14" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-muted rounded flex-1" />
                <div className="h-9 bg-muted rounded flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (templates?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="Search" size={32} className="text-text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No templates found</h3>
        <p className="text-text-secondary text-center max-w-md">
          We couldn't find any templates matching your criteria. Try adjusting your search or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <TemplateCard
            key={template?.id}
            template={template}
            onPreview={onPreview}
            onUseTemplate={onUseTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateGrid;