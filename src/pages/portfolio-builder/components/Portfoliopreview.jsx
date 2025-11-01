import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioPreview = ({ portfolio, template, design, onPublish }) => {
  const renderModernCleanTemplate = () => (
    <div 
      className="min-h-full bg-background text-foreground"
      style={{ 
        fontFamily: design?.fontFamily || 'Inter',
        '--primary-color': design?.primaryColor || '#3b82f6'
      }}
    >
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            {portfolio?.profile?.name || 'Your Name'}
          </h1>
          <p className="text-xl text-text-secondary mb-4">
            {portfolio?.profile?.title || 'Your Professional Title'}
          </p>
          {portfolio?.profile?.bio && (
            <p className="text-text-secondary max-w-2xl">
              {portfolio?.profile?.bio}
            </p>
          )}
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-6">
            {portfolio?.profile?.email && (
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Mail" size={16} />
                <span>{portfolio?.profile?.email}</span>
              </div>
            )}
            {portfolio?.profile?.phone && (
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Phone" size={16} />
                <span>{portfolio?.profile?.phone}</span>
              </div>
            )}
            {portfolio?.profile?.location && (
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="MapPin" size={16} />
                <span>{portfolio?.profile?.location}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            {portfolio?.profile?.website && (
              <a
                href={portfolio?.profile?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
              >
                <Icon name="Globe" size={16} />
                <span className="text-sm">Website</span>
              </a>
            )}
            {portfolio?.profile?.linkedin && (
              <a
                href={portfolio?.profile?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
              >
                <Icon name="Linkedin" size={16} />
                <span className="text-sm">LinkedIn</span>
              </a>
            )}
            {portfolio?.profile?.github && (
              <a
                href={portfolio?.profile?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
              >
                <Icon name="Github" size={16} />
                <span className="text-sm">GitHub</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-12">
        {portfolio?.sections?.filter(section => section?.visible)?.map((section) => (
          <section key={section?.id} className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2">
              {section?.title}
            </h2>
            
            {section?.type === 'text' && (
              <div className="prose max-w-none">
                <p className="text-text-secondary whitespace-pre-wrap">
                  {section?.content}
                </p>
              </div>
            )}
            
            {section?.type === 'list' && Array.isArray(section?.content) && (
              <ul className="space-y-2">
                {section?.content?.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="mt-1 flex-shrink-0" style={{ color: design?.primaryColor || '#3b82f6' }} />
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {section?.type === 'skills' && Array.isArray(section?.content) && (
              <div className="flex flex-wrap gap-2">
                {section?.content?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full border"
                    style={{ 
                      backgroundColor: `${design?.primaryColor || '#3b82f6'}20`,
                      borderColor: design?.primaryColor || '#3b82f6',
                      color: design?.primaryColor || '#3b82f6'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            
            {section?.type === 'cards' && Array.isArray(section?.content) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section?.content?.map((card, index) => (
                  <div key={card?.id || index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-150">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {card?.name}
                    </h3>
                    <p className="text-text-secondary mb-4">
                      {card?.description}
                    </p>
                    {card?.url && (
                      <a
                        href={card?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-sm font-medium hover:underline"
                        style={{ color: design?.primaryColor || '#3b82f6' }}
                      >
                        <span>View Project</span>
                        <Icon name="ExternalLink" size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );

  const renderMinimalistTemplate = () => (
    <div 
      className="min-h-full bg-white text-gray-900"
      style={{ 
        fontFamily: design?.fontFamily || 'Inter',
        '--primary-color': design?.primaryColor || '#3b82f6'
      }}
    >
      {/* Minimal Header */}
      <header className="text-center py-16 px-6">
        <h1 className="text-5xl font-light mb-4">
          {portfolio?.profile?.name || 'Your Name'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {portfolio?.profile?.title || 'Your Professional Title'}
        </p>
        {portfolio?.profile?.bio && (
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {portfolio?.profile?.bio}
          </p>
        )}
      </header>

      {/* Minimal Sections */}
      <main className="max-w-3xl mx-auto px-6 pb-16 space-y-16">
        {portfolio?.sections?.filter(section => section?.visible)?.map((section) => (
          <section key={section?.id} className="space-y-6">
            <h2 className="text-3xl font-light text-center">
              {section?.title}
            </h2>
            
            {section?.type === 'text' && (
              <div className="text-center">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {section?.content}
                </p>
              </div>
            )}
            
            {section?.type === 'skills' && Array.isArray(section?.content) && (
              <div className="flex flex-wrap justify-center gap-3">
                {section?.content?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm border rounded-full"
                    style={{ 
                      borderColor: design?.primaryColor || '#3b82f6',
                      color: design?.primaryColor || '#3b82f6'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            
            {section?.type === 'cards' && Array.isArray(section?.content) && (
              <div className="space-y-8">
                {section?.content?.map((card, index) => (
                  <div key={card?.id || index} className="text-center border-b border-gray-200 pb-8 last:border-b-0">
                    <h3 className="text-xl font-medium mb-3">
                      {card?.name}
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-xl mx-auto">
                      {card?.description}
                    </p>
                    {card?.url && (
                      <a
                        href={card?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-sm font-medium hover:underline"
                        style={{ color: design?.primaryColor || '#3b82f6' }}
                      >
                        <span>View Project</span>
                        <Icon name="ExternalLink" size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );

  const renderTemplate = () => {
    switch (template?.value) {
      case 'minimalist':
        return renderMinimalistTemplate();
      case 'modern-clean':
      default:
        return renderModernCleanTemplate();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Icon name="Eye" size={18} className="text-primary" />
          <span className="font-medium text-text-primary">Live Preview</span>
          <span className="text-sm text-text-secondary">
            {template?.label || 'Modern Clean'}
          </span>
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={onPublish}
          iconName="Share"
          iconPosition="left"
          iconSize={16}
        >
          Publish Portfolio
        </Button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="min-h-full">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;