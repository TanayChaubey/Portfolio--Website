import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'portfolio-builder',
      label: 'Portfolio Builder',
      path: '/portfolio-builder',
      icon: 'Edit3',
      description: 'Create and customize your portfolio'
    },
    {
      id: 'template-preview',
      label: 'Template Gallery',
      path: '/template-preview',
      icon: 'Layout',
      description: 'Browse and select templates'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Briefcase" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-text-primary leading-none">
              Portfolio Builder Pro
            </span>
            <span className="text-xs text-text-secondary leading-none">
              Professional Portfolio Creation
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.id}
              variant={isActiveRoute(item?.path) ? "default" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={18}
              className="transition-all duration-150 ease-out hover:scale-105"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={toggleMobileMenu}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
            className="transition-transform duration-150 ease-out"
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border animate-fade-in">
          <nav className="px-4 py-3 space-y-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.id}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-150 ease-out ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-primary hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  color={isActiveRoute(item?.path) ? 'white' : 'currentColor'} 
                />
                <div className="flex flex-col">
                  <span className="font-medium">{item?.label}</span>
                  <span className={`text-sm ${
                    isActiveRoute(item?.path) 
                      ? 'text-primary-foreground/80' 
                      : 'text-text-secondary'
                  }`}>
                    {item?.description}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;