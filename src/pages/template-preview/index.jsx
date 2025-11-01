import React from 'react';
import Filterbar from './components/Filterbar';
import TemplateGrid from './components/TemplateGrid';
import TemplateModal from './components/Templatemodal';

const TemplatePreviewPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Template Gallery</h1>
          <p className="text-sm text-text-secondary">Browse and preview templates for your portfolio</p>
        </div>

        <Filterbar />
        <div className="mt-6">
          <TemplateGrid />
        </div>

        {/* Template modal is rendered at root of this page; it manages its own open state internally */}
        <TemplateModal />
      </div>
    </div>
  );
};

export default TemplatePreviewPage;
