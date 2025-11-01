import React from 'react';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SectionEditor = ({ section, onSectionChange, onClose }) => {
  const handleTitleChange = (title) => {
    onSectionChange({
      ...section,
      title
    });
  };

  const handleContentChange = (content) => {
    onSectionChange({
      ...section,
      content
    });
  };

  const renderTextEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Content</label>
        <textarea
          value={section?.content || ''}
          onChange={(e) => handleContentChange(e?.target?.value)}
          rows={6}
          placeholder="Enter your content here..."
          className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
        />
      </div>
    </div>
  );

  const renderListEditor = () => {
    const items = Array.isArray(section?.content) ? section?.content : [];

    const addItem = () => {
      handleContentChange([...items, 'New item']);
    };

    const updateItem = (index, value) => {
      const newItems = [...items];
      newItems[index] = value;
      handleContentChange(newItems);
    };

    const removeItem = (index) => {
      const newItems = items?.filter((_, i) => i !== index);
      handleContentChange(newItems);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-text-primary">List Items</label>
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
          >
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {items?.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e?.target?.value)}
                placeholder={`Item ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                iconName="Trash2"
                iconSize={16}
                className="text-error hover:bg-error/10"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCardsEditor = () => {
    const cards = Array.isArray(section?.content) ? section?.content : [];

    const addCard = () => {
      const newCard = {
        id: Date.now()?.toString(),
        name: 'New Project',
        description: 'Project description',
        url: ''
      };
      handleContentChange([...cards, newCard]);
    };

    const updateCard = (index, field, value) => {
      const newCards = [...cards];
      newCards[index] = { ...newCards?.[index], [field]: value };
      handleContentChange(newCards);
    };

    const removeCard = (index) => {
      const newCards = cards?.filter((_, i) => i !== index);
      handleContentChange(newCards);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-text-primary">Project Cards</label>
          <Button
            variant="outline"
            size="sm"
            onClick={addCard}
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
          >
            Add Project
          </Button>
        </div>
        <div className="space-y-4">
          {cards?.map((card, index) => (
            <div key={card?.id || index} className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-text-primary">Project {index + 1}</h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCard(index)}
                  iconName="Trash2"
                  iconSize={16}
                  className="text-error hover:bg-error/10"
                />
              </div>
              
              <Input
                label="Project Name"
                type="text"
                value={card?.name || ''}
                onChange={(e) => updateCard(index, 'name', e?.target?.value)}
                placeholder="Enter project name"
              />
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                <textarea
                  value={card?.description || ''}
                  onChange={(e) => updateCard(index, 'description', e?.target?.value)}
                  rows={3}
                  placeholder="Describe your project..."
                  className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
                />
              </div>
              
              <Input
                label="Project URL"
                type="url"
                value={card?.url || ''}
                onChange={(e) => updateCard(index, 'url', e?.target?.value)}
                placeholder="https://github.com/username/project"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsEditor = () => {
    const skills = Array.isArray(section?.content) ? section?.content : [];

    const addSkill = () => {
      handleContentChange([...skills, 'New Skill']);
    };

    const updateSkill = (index, value) => {
      const newSkills = [...skills];
      newSkills[index] = value;
      handleContentChange(newSkills);
    };

    const removeSkill = (index) => {
      const newSkills = skills?.filter((_, i) => i !== index);
      handleContentChange(newSkills);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-text-primary">Skills</label>
          <Button
            variant="outline"
            size="sm"
            onClick={addSkill}
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
          >
            Add Skill
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {skills?.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e?.target?.value)}
                placeholder={`Skill ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(index)}
                iconName="Trash2"
                iconSize={16}
                className="text-error hover:bg-error/10"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    switch (section?.type) {
      case 'text':
        return renderTextEditor();
      case 'list':
        return renderListEditor();
      case 'cards':
        return renderCardsEditor();
      case 'skills':
        return renderSkillsEditor();
      default:
        return renderTextEditor();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-text-primary">Edit Section</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          iconName="X"
          iconSize={16}
        />
      </div>
      <Input
        label="Section Title"
        type="text"
        value={section?.title || ''}
        onChange={(e) => handleTitleChange(e?.target?.value)}
        placeholder="Enter section title"
        required
      />
      {renderEditor()}
    </div>
  );
};

export default SectionEditor;