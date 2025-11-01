import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const SectionManager = ({ sections, onSectionsChange }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const sectionTypes = [
    { value: 'text', label: 'Text Section', icon: 'FileText' },
    { value: 'list', label: 'List Section', icon: 'List' },
    { value: 'cards', label: 'Project Cards', icon: 'Grid' },
    { value: 'skills', label: 'Skills', icon: 'Award' },
    { value: 'experience', label: 'Experience', icon: 'Briefcase' },
    { value: 'education', label: 'Education', icon: 'GraduationCap' }
  ];

  const addSection = (type) => {
    const newSection = {
      id: Date.now()?.toString(),
      type: type,
      title: getSectionDefaultTitle(type),
      content: getSectionDefaultContent(type),
      visible: true
    };

    onSectionsChange([...sections, newSection]);
  };

  const getSectionDefaultTitle = (type) => {
    const titles = {
      text: 'About Me',
      list: 'Key Achievements',
      cards: 'Projects',
      skills: 'Skills & Technologies',
      experience: 'Work Experience',
      education: 'Education'
    };
    return titles?.[type] || 'New Section';
  };

  const getSectionDefaultContent = (type) => {
    switch (type) {
      case 'text':
        return 'Add your content here...';
      case 'list':
        return ['Achievement 1', 'Achievement 2', 'Achievement 3'];
      case 'cards':
        return [
          {
            id: '1',
            name: 'Project Name',
            description: 'Brief description of your project and technologies used.',
            url: 'https://github.com/username/project'
          }
        ];
      case 'skills':
        return ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'];
      case 'experience':
        return [
          {
            id: '1',
            company: 'Company Name',
            position: 'Job Title',
            duration: 'Jan 2023 - Present',
            description: 'Key responsibilities and achievements in this role.'
          }
        ];
      case 'education':
        return [
          {
            id: '1',
            institution: 'University Name',
            degree: 'Bachelor of Science in Computer Science',
            duration: '2019 - 2023',
            gpa: '3.8/4.0'
          }
        ];
      default:
        return '';
    }
  };

  const removeSection = (sectionId) => {
    onSectionsChange(sections?.filter(section => section?.id !== sectionId));
  };

  const toggleSectionVisibility = (sectionId) => {
    onSectionsChange(
      sections?.map(section =>
        section?.id === sectionId
          ? { ...section, visible: !section?.visible }
          : section
      )
    );
  };

  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [movedSection] = newSections?.splice(fromIndex, 1);
    newSections?.splice(toIndex, 0, movedSection);
    onSectionsChange(newSections);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveSection(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const getSectionIcon = (type) => {
    const sectionType = sectionTypes?.find(st => st?.value === type);
    return sectionType?.icon || 'FileText';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Layers" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Sections</h3>
        </div>
        <span className="text-sm text-text-secondary">{sections?.length} sections</span>
      </div>
      {/* Add Section */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-3">Add New Section</h4>
        <div className="grid grid-cols-2 gap-2">
          {sectionTypes?.map((type) => (
            <Button
              key={type?.value}
              variant="outline"
              size="sm"
              onClick={() => addSection(type?.value)}
              iconName={type?.icon}
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              {type?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Sections List */}
      <div className="space-y-2">
        {sections?.map((section, index) => (
          <div
            key={section?.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-card border border-border rounded-lg p-3 cursor-move transition-all duration-150 ${
              draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="GripVertical" size={16} className="text-text-secondary" />
                <Icon name={getSectionIcon(section?.type)} size={16} className="text-primary" />
                <div>
                  <h5 className="font-medium text-text-primary">{section?.title}</h5>
                  <p className="text-sm text-text-secondary capitalize">{section?.type} section</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSectionVisibility(section?.id)}
                  iconName={section?.visible ? "Eye" : "EyeOff"}
                  iconSize={16}
                  className={section?.visible ? 'text-success' : 'text-text-secondary'}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(section?.id)}
                  iconName="Trash2"
                  iconSize={16}
                  className="text-error hover:bg-error/10"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {sections?.length === 0 && (
        <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <Icon name="Plus" size={32} className="mx-auto text-text-secondary mb-2" />
          <p className="text-text-secondary">No sections added yet</p>
          <p className="text-sm text-text-secondary">Add your first section to get started</p>
        </div>
      )}
    </div>
  );
};

export default SectionManager;