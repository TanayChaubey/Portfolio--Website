-- Location: supabase/migrations/20241010045844_portfolio_builder_with_auth.sql
-- Schema Analysis: Fresh project with no existing schema
-- Integration Type: NEW_MODULE - Complete portfolio management system
-- Dependencies: None (fresh database)

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.portfolio_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.section_type AS ENUM ('text', 'skills', 'cards', 'gallery', 'contact');
CREATE TYPE public.template_category AS ENUM ('modern', 'classic', 'creative', 'minimal');

-- 2. Core Tables
-- Critical intermediary table for PostgREST compatibility
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio templates table
CREATE TABLE public.portfolio_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category public.template_category DEFAULT 'modern'::public.template_category,
    preview_image_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Main portfolios table
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.portfolio_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status public.portfolio_status DEFAULT 'draft'::public.portfolio_status,
    profile_data JSONB DEFAULT '{}'::jsonb,
    design_settings JSONB DEFAULT '{}'::jsonb,
    seo_settings JSONB DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio sections table
CREATE TABLE public.portfolio_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    section_type public.section_type NOT NULL,
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON public.portfolios(slug);
CREATE INDEX idx_portfolios_status ON public.portfolios(status);
CREATE INDEX idx_portfolio_sections_portfolio_id ON public.portfolio_sections(portfolio_id);
CREATE INDEX idx_portfolio_sections_sort_order ON public.portfolio_sections(portfolio_id, sort_order);
CREATE INDEX idx_portfolio_templates_category ON public.portfolio_templates(category);

-- 4. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to generate unique portfolio slug
CREATE OR REPLACE FUNCTION public.generate_portfolio_slug(title_text TEXT, user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base slug from title
    base_slug := lower(regexp_replace(trim(title_text), '[^a-zA-Z0-9\s]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    -- Ensure slug is not empty
    IF base_slug = '' THEN
        base_slug := 'portfolio';
    END IF;
    
    final_slug := base_slug;
    
    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM public.portfolios WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$;

-- Function to update portfolio timestamp
CREATE OR REPLACE FUNCTION public.update_portfolio_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_templates ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Pattern 1: Core user table (user_profiles) - Simple direct access
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for portfolios
CREATE POLICY "users_manage_own_portfolios"
ON public.portfolios
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for portfolio sections
CREATE POLICY "users_manage_own_portfolio_sections"
ON public.portfolio_sections
FOR ALL
TO authenticated
USING (
    portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = auth.uid()
    )
);

-- Pattern 4: Public read access for published portfolios
CREATE POLICY "public_can_read_published_portfolios"
ON public.portfolios
FOR SELECT
TO public
USING (status = 'published'::public.portfolio_status);

CREATE POLICY "public_can_read_published_portfolio_sections"
ON public.portfolio_sections
FOR SELECT
TO public
USING (
    is_visible = true AND
    portfolio_id IN (
        SELECT id FROM public.portfolios WHERE status = 'published'::public.portfolio_status
    )
);

-- Pattern 4: Public read access for templates
CREATE POLICY "public_can_read_portfolio_templates"
ON public.portfolio_templates
FOR SELECT
TO public
USING (true);

-- 7. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_portfolios_timestamp
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_portfolio_timestamp();

CREATE TRIGGER update_portfolio_sections_timestamp
  BEFORE UPDATE ON public.portfolio_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_portfolio_timestamp();

-- 8. Sample Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    modern_template_id UUID := gen_random_uuid();
    creative_template_id UUID := gen_random_uuid();
    sample_portfolio_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@portfolio.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Portfolio Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@portfolio.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert portfolio templates
    INSERT INTO public.portfolio_templates (id, name, description, category, is_premium) VALUES
        (modern_template_id, 'Modern Clean', 'Professional and minimalist design with clean typography', 'modern'::public.template_category, false),
        (creative_template_id, 'Creative Portfolio', 'Bold and colorful design perfect for creative professionals', 'creative'::public.template_category, true),
        (gen_random_uuid(), 'Classic Professional', 'Traditional business-style portfolio layout', 'classic'::public.template_category, false),
        (gen_random_uuid(), 'Minimal Dark', 'Sleek dark-themed minimal design', 'minimal'::public.template_category, false);

    -- Create sample portfolio
    INSERT INTO public.portfolios (id, user_id, template_id, title, slug, status, profile_data, design_settings) VALUES
        (sample_portfolio_id, user_uuid, modern_template_id, 'John Doe Portfolio', 'john-doe-portfolio', 'published'::public.portfolio_status,
         '{"name": "John Doe", "title": "Full Stack Developer", "bio": "Passionate developer with 5+ years of experience", "email": "john@example.com", "location": "San Francisco, CA", "website": "https://johndoe.dev", "linkedin": "https://linkedin.com/in/johndoe", "github": "https://github.com/johndoe"}'::jsonb,
         '{"fontFamily": "Inter", "primaryColor": "#3b82f6", "backgroundColor": "#ffffff", "textColor": "#1f2937"}'::jsonb);

    -- Create sample sections
    INSERT INTO public.portfolio_sections (portfolio_id, section_type, title, content, sort_order, is_visible) VALUES
        (sample_portfolio_id, 'text'::public.section_type, 'About Me', 
         '{"content": "I am a passionate full-stack developer with expertise in React, Node.js, and modern web technologies. I love creating innovative solutions that make a difference."}'::jsonb, 1, true),
         
        (sample_portfolio_id, 'skills'::public.section_type, 'Skills & Technologies',
         '{"skills": ["JavaScript", "React", "Node.js", "TypeScript", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "Git"]}'::jsonb, 2, true),
         
        (sample_portfolio_id, 'cards'::public.section_type, 'Featured Projects',
         '{"projects": [{"id": 1, "name": "E-commerce Platform", "description": "Full-stack e-commerce solution with React and Node.js", "url": "https://github.com/johndoe/ecommerce", "image": "/api/placeholder/400/250", "technologies": ["React", "Node.js", "MongoDB"]}, {"id": 2, "name": "Task Management App", "description": "Collaborative task management application with real-time updates", "url": "https://github.com/johndoe/taskapp", "image": "/api/placeholder/400/250", "technologies": ["React", "Firebase", "Material-UI"]}]}'::jsonb, 3, true),
         
        (sample_portfolio_id, 'contact'::public.section_type, 'Get In Touch',
         '{"message": "I am always interested in new opportunities and collaborations. Feel free to reach out!", "showEmail": true, "showPhone": false, "showSocial": true}'::jsonb, 4, true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;