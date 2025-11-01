import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterBar = ({ 
  selectedCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  totalTemplates,
  filteredCount 
}) => {
  const categories = [
    { id: 'all', label: 'All Templates', icon: 'Grid' },
    { id: 'modern', label: 'Modern', icon: 'Zap' },
    { id: 'minimalist', label: 'Minimalist', icon: 'Minus' },
    { id: 'creative', label: 'Creative', icon: 'Palette' },
    { id: 'professional', label: 'Professional', icon: 'Briefcase' },
    { id: 'artistic', label: 'Artistic', icon: 'Brush' }
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { id: 'newest', label: 'Newest First', icon: 'Clock' },
    { id: 'rating', label: 'Highest Rated', icon: 'Star' },
    { id: 'name', label: 'Name A-Z', icon: 'ArrowUpDown' }
  ];

  return (
    <div className="bg-surface border-b border-border">
      <div className="p-6">
        {/* Search and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="relative">
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary z-10" 
              />
              <Input
                type="search"
                placeholder="Search templates by name or style..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e?.target?.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="lg:w-48">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 appearance-none pr-10"
              >
                {sortOptions?.map((option) => (
                  <option key={option?.id} value={option?.id}>
                    {option?.label}
                  </option>
                ))}
              </select>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? "default" : "outline"}
              onClick={() => onCategoryChange(category?.id)}
              iconName={category?.icon}
              iconPosition="left"
              iconSize={16}
              className="transition-all duration-150 hover:scale-105"
            >
              {category?.label}
            </Button>
          ))}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={16} />
            <span>
              Showing {filteredCount} of {totalTemplates} templates
              {selectedCategory !== 'all' && (
                <span className="ml-1">
                  in <span className="font-medium text-text-primary">{categories?.find(c => c?.id === selectedCategory)?.label}</span>
                </span>
              )}
              {searchQuery && (
                <span className="ml-1">
                  matching "<span className="font-medium text-text-primary">{searchQuery}</span>"
                </span>
              )}
            </span>
          </div>

          {(selectedCategory !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              onClick={() => {
                onCategoryChange('all');
                onSearchChange('');
              }}
              iconName="X"
              iconPosition="left"
              iconSize={14}
              className="text-text-secondary hover:text-text-primary"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;