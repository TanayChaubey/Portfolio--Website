import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const ProfileEditor = ({ profile, onProfileChange, errors = {} }) => {
  const handleInputChange = (field, value) => {
    onProfileChange({
      ...profile,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="User" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Profile Information</h3>
      </div>
      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={profile?.name || ''}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
        />

        <Input
          label="Professional Title"
          type="text"
          placeholder="e.g., Software Developer, UX Designer"
          value={profile?.title || ''}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Bio / About Me
            <span className="text-error ml-1">*</span>
          </label>
          <textarea
            placeholder="Write a brief description about yourself, your experience, and goals..."
            value={profile?.bio || ''}
            onChange={(e) => handleInputChange('bio', e?.target?.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 ${
              errors?.bio ? 'border-error' : 'border-border'
            }`}
          />
          {errors?.bio && (
            <p className="text-sm text-error">{errors?.bio}</p>
          )}
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={profile?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={profile?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
        />

        <Input
          label="Location"
          type="text"
          placeholder="City, State/Country"
          value={profile?.location || ''}
          onChange={(e) => handleInputChange('location', e?.target?.value)}
          error={errors?.location}
        />

        <Input
          label="Website/Portfolio URL"
          type="url"
          placeholder="https://yourwebsite.com"
          value={profile?.website || ''}
          onChange={(e) => handleInputChange('website', e?.target?.value)}
          error={errors?.website}
        />

        <Input
          label="LinkedIn Profile"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={profile?.linkedin || ''}
          onChange={(e) => handleInputChange('linkedin', e?.target?.value)}
          error={errors?.linkedin}
        />

        <Input
          label="GitHub Profile"
          type="url"
          placeholder="https://github.com/yourusername"
          value={profile?.github || ''}
          onChange={(e) => handleInputChange('github', e?.target?.value)}
          error={errors?.github}
        />
      </div>
    </div>
  );
};

export default ProfileEditor;