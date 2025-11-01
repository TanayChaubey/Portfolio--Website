import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { PortfolioService } from '../../services/portfolioService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import WorkflowProgress from '../../components/ui/WorkflowProgress';
import AuthModal from '../../components/auth/AuthModal';

// Import components
import TemplateSelector from './components/TemplateSelector';
import ProfileEditor from './components/ProfileEditor';
import SectionManager from './components/SectionManager';
import SectionEditor from './components/SectionEditor';
import DesignCustomizer from './components/DesignCustomizer';
import PortfolioPreview from './components/PortfolioPreview';
import SaveManager from './components/SaveManager';

// Portfolio reducer for complex state management
const portfolioReducer = (state, action) => {
  switch (action?.type) {
    case 'SET_TEMPLATE':
      return { ...state, template: action?.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action?.payload };
    case 'SET_SECTIONS':
      return { ...state, sections: action?.payload };
    case 'SET_DESIGN':
      return { ...state, design: action?.payload };
    case 'LOAD_PORTFOLIO':
      return { ...action?.payload };
    case 'RESET_PORTFOLIO':
      return action?.payload;
    default:
      return state;
  }
};

const initialPortfolioState = {
  id: null,
  template: {
    value: 'modern-clean',
    label: 'Modern Clean',
    description: 'Professional and minimalist design with clean typography'
  },
  profile: {
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  sections: [],
  design: {
    fontFamily: 'Inter',
    primaryColor: '#3b82f6'
  }
};

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [portfolio, dispatch] = useReducer(portfolioReducer, initialPortfolioState);
  const [activeTab, setActiveTab] = useState('template');
  const [editingSection, setEditingSection] = useState(null);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Show demo/preview mode
        setLoading(false);
      } else {
        // Load user's existing portfolio or create new one
        loadUserPortfolio();
      }
    }
  }, [user, authLoading]);

  const loadUserPortfolio = async () => {
    try {
      setLoading(true);
      const portfolios = await PortfolioService?.getUserPortfolios();
      
      if (portfolios?.length > 0) {
        // Load the most recent portfolio
        const latestPortfolio = portfolios?.[0];
        const portfolioData = {
          id: latestPortfolio?.id,
          template: {
            id: latestPortfolio?.template?.id,
            value: latestPortfolio?.template?.name?.toLowerCase()?.replace(/\s+/g, '-'),
            label: latestPortfolio?.template?.name,
            description: latestPortfolio?.template?.description
          },
          profile: latestPortfolio?.profile_data || initialPortfolioState?.profile,
          sections: latestPortfolio?.sections?.sort((a, b) => a?.sort_order - b?.sort_order)?.map(section => ({
            id: section?.id,
            type: section?.section_type,
            title: section?.title,
            content: section?.content?.content || section?.content?.skills || section?.content?.projects || section?.content,
            visible: section?.is_visible
          })) || [],
          design: latestPortfolio?.design_settings || initialPortfolioState?.design
        };
        
        dispatch({ type: 'LOAD_PORTFOLIO', payload: portfolioData });
        setLastSaved(new Date(latestPortfolio?.updated_at));
      } else {
        // Create a new portfolio
        createNewPortfolio();
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      // Continue with default state
    } finally {
      setLoading(false);
    }
  };

  const createNewPortfolio = async () => {
    try {
      const newPortfolio = await PortfolioService?.createPortfolio({
        user_id: user?.id,
        title: `${user?.user_metadata?.full_name || 'My'} Portfolio`,
        template_id: null, // Will be set when user selects template
        profile_data: initialPortfolioState?.profile,
        design_settings: initialPortfolioState?.design,
        status: 'draft'
      });

      dispatch({ 
        type: 'LOAD_PORTFOLIO', 
        payload: { 
          ...initialPortfolioState, 
          id: newPortfolio?.id 
        } 
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  const savePortfolioToDatabase = async (isAutoSave = false) => {
    if (!user || !portfolio?.id) {
      return;
    }

    setSaveStatus('saving');
    
    try {
      // Update portfolio
      await PortfolioService?.updatePortfolio(portfolio?.id, {
        profile_data: portfolio?.profile,
        design_settings: portfolio?.design,
        template_id: portfolio?.template?.id || null
      });

      setSaveStatus('saved');
      setLastSaved(new Date());
      
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setSaveStatus('error');
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!portfolio?.profile?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!portfolio?.profile?.title?.trim()) {
      newErrors.title = 'Professional title is required';
    }
    
    if (!portfolio?.profile?.bio?.trim()) {
      newErrors.bio = 'Bio is required';
    }
    
    if (portfolio?.profile?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(portfolio?.profile?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleTemplateChange = (template) => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  };

  const handleProfileChange = (profile) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
    // Clear errors when user starts typing
    if (errors?.name && profile?.name) {
      setErrors(prev => ({ ...prev, name: null }));
    }
    if (errors?.title && profile?.title) {
      setErrors(prev => ({ ...prev, title: null }));
    }
    if (errors?.bio && profile?.bio) {
      setErrors(prev => ({ ...prev, bio: null }));
    }
  };

  const handleSectionsChange = (sections) => {
    dispatch({ type: 'SET_SECTIONS', payload: sections });
  };

  const handleSectionEdit = (section) => {
    const updatedSections = portfolio?.sections?.map(s => 
      s?.id === section?.id ? section : s
    );
    dispatch({ type: 'SET_SECTIONS', payload: updatedSections });
  };

  const handleDesignChange = (design) => {
    dispatch({ type: 'SET_DESIGN', payload: design });
  };

  const handlePublish = async () => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (validateProfile() && portfolio?.id) {
      try {
        await PortfolioService?.publishPortfolio(portfolio?.id);
        alert('Portfolio published successfully! \n\nYour portfolio is now live and accessible to viewers.');
      } catch (error) {
        alert('Failed to publish portfolio. Please try again.');
      }
    } else {
      setActiveTab('profile');
      alert('Please complete all required profile fields before publishing.');
    }
  };

  const handleSignIn = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const tabs = [
    { id: 'template', label: 'Template', icon: 'Layout' },
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'sections', label: 'Sections', icon: 'Layers' },
    { id: 'design', label: 'Design', icon: 'Palette' },
    { id: 'save', label: 'Save', icon: 'Save' }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading Portfolio Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WorkflowProgress 
        currentPhase="content-creation" 
        saveStatus={saveStatus}
        lastSaved={lastSaved}
      />
      
      {/* Preview Mode Banner */}
      {!user && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Icon name="Eye" size={20} className="text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">Preview Mode</p>
                <p className="text-blue-600 text-sm">Sign in to save your portfolio and access all features</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                iconName="LogIn"
                iconPosition="left"
                iconSize={16}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSignUp}
                iconName="UserPlus"
                iconPosition="left"
                iconSize={16}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Builder Panel */}
        <div className={`${
          isMobilePreview ? 'hidden' : 'block'
        } lg:block w-full lg:w-96 xl:w-[28rem] bg-surface border-r border-border flex flex-col`}>
          
          {/* Mobile Preview Toggle */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-text-primary">Portfolio Builder</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobilePreview(true)}
              iconName="Eye"
              iconPosition="left"
              iconSize={16}
            >
              Preview
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-border bg-muted/30">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary bg-background' :'text-text-secondary hover:text-text-primary hover:bg-muted/50'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'template' && (
              <TemplateSelector
                selectedTemplate={portfolio?.template}
                onTemplateChange={handleTemplateChange}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileEditor
                profile={portfolio?.profile}
                onProfileChange={handleProfileChange}
                errors={errors}
              />
            )}

            {activeTab === 'sections' && (
              <div className="space-y-6">
                <SectionManager
                  sections={portfolio?.sections}
                  onSectionsChange={handleSectionsChange}
                />
                
                {editingSection && (
                  <SectionEditor
                    section={editingSection}
                    onSectionChange={handleSectionEdit}
                    onClose={() => setEditingSection(null)}
                  />
                )}
                
                {portfolio?.sections?.length > 0 && !editingSection && (
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-3">Edit Sections</h4>
                    <div className="space-y-2">
                      {portfolio?.sections?.map((section) => (
                        <Button
                          key={section?.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSection(section)}
                          iconName="Edit3"
                          iconPosition="left"
                          iconSize={14}
                          className="w-full justify-start"
                        >
                          Edit "{section?.title}"
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'design' && (
              <DesignCustomizer
                design={portfolio?.design}
                onDesignChange={handleDesignChange}
              />
            )}

            {activeTab === 'save' && (
              <SaveManager
                portfolio={portfolio}
                onSave={savePortfolioToDatabase}
                saveStatus={saveStatus}
                lastSaved={lastSaved}
                user={user}
                onSignIn={handleSignIn}
              />
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`${
          isMobilePreview ? 'block' : 'hidden'
        } lg:block flex-1 bg-muted/20 relative`}>
          
          {/* Mobile Preview Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-surface border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobilePreview(false)}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
            >
              Back to Editor
            </Button>
            <span className="font-medium text-text-primary">Preview</span>
            <Button
              variant="default"
              size="sm"
              onClick={handlePublish}
              iconName="Share"
              iconPosition="left"
              iconSize={16}
            >
              Publish
            </Button>
          </div>

          {/* Preview Frame */}
          <div className="h-full bg-white shadow-lg mx-4 my-4 rounded-lg overflow-hidden">
            <PortfolioPreview
              portfolio={portfolio}
              template={portfolio?.template}
              design={portfolio?.design}
              onPublish={handlePublish}
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default PortfolioBuilder;