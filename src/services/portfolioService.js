import { supabase } from '../lib/supabase';

export class PortfolioService {
  // Get all portfolios for the authenticated user
  static async getUserPortfolios() {
    try {
      const { data, error } = await supabase
        ?.from('portfolios')
        ?.select(`
          *,
          template:portfolio_templates(*),
          sections:portfolio_sections(*)
        `)
        ?.order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Get a single portfolio by ID
  static async getPortfolio(portfolioId) {
    try {
      const { data, error } = await supabase
        ?.from('portfolios')
        ?.select(`
          *,
          template:portfolio_templates(*),
          sections:portfolio_sections(*)
        `)
        ?.eq('id', portfolioId)
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Get portfolio by slug (for public access)
  static async getPortfolioBySlug(slug) {
    try {
      const { data, error } = await supabase
        ?.from('portfolios')
        ?.select(`
          *,
          template:portfolio_templates(*),
          sections:portfolio_sections(*)
        `)
        ?.eq('slug', slug)
        ?.eq('status', 'published')
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Create a new portfolio
  static async createPortfolio(portfolioData) {
    try {
      // Generate unique slug
      const { data: slugData, error: slugError } = await supabase
        ?.rpc('generate_portfolio_slug', {
          title_text: portfolioData?.title,
          user_uuid: portfolioData?.user_id
        });

      if (slugError) {
        throw slugError;
      }

      const { data, error } = await supabase
        ?.from('portfolios')
        ?.insert([{
          ...portfolioData,
          slug: slugData
        }])
        ?.select(`
          *,
          template:portfolio_templates(*),
          sections:portfolio_sections(*)
        `)
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Update portfolio
  static async updatePortfolio(portfolioId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('portfolios')
        ?.update(updates)
        ?.eq('id', portfolioId)
        ?.select(`
          *,
          template:portfolio_templates(*),
          sections:portfolio_sections(*)
        `)
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Delete portfolio
  static async deletePortfolio(portfolioId) {
    try {
      const { error } = await supabase
        ?.from('portfolios')
        ?.delete()
        ?.eq('id', portfolioId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Publish portfolio
  static async publishPortfolio(portfolioId) {
    try {
      const { data, error } = await supabase
        ?.from('portfolios')
        ?.update({
          status: 'published',
          published_at: new Date()?.toISOString()
        })
        ?.eq('id', portfolioId)
        ?.select()
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }
}

export class PortfolioSectionService {
  // Create new section
  static async createSection(sectionData) {
    try {
      const { data, error } = await supabase
        ?.from('portfolio_sections')
        ?.insert([sectionData])
        ?.select()
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Update section
  static async updateSection(sectionId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('portfolio_sections')
        ?.update(updates)
        ?.eq('id', sectionId)
        ?.select()
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Delete section
  static async deleteSection(sectionId) {
    try {
      const { error } = await supabase
        ?.from('portfolio_sections')
        ?.delete()
        ?.eq('id', sectionId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Reorder sections
  static async reorderSections(sectionUpdates) {
    try {
      const updates = sectionUpdates?.map(({ id, sort_order }) => 
        supabase
          ?.from('portfolio_sections')
          ?.update({ sort_order })
          ?.eq('id', id)
      );

      const results = await Promise.all(updates);
      
      // Check for errors
      const errors = results?.filter(result => result?.error);
      if (errors?.length > 0) {
        throw errors?.[0]?.error;
      }

      return true;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }
}

export class TemplateService {
  // Get all available templates
  static async getTemplates() {
    try {
      const { data, error } = await supabase
        ?.from('portfolio_templates')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }

  // Get template by ID
  static async getTemplate(templateId) {
    try {
      const { data, error } = await supabase
        ?.from('portfolio_templates')
        ?.select('*')
        ?.eq('id', templateId)
        ?.single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or deleted.');
      }
      throw error;
    }
  }
}