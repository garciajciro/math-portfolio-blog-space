export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
  github?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'academic' | 'other';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  cover_image?: string;
}

export interface PersonalPost {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'story' | 'update' | 'thought';
  image_urls?: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  date: string;
  journal?: string;
  link?: string;
  pdf_url?: string;
  status: 'published' | 'submitted' | 'preprint' | 'draft';
}

export interface AboutData {
  id?: string;
  name: string;
  title: string;
  bio: string;
  image_url: string;
  skills: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear: number | null;
  }[];
  researchInterests?: {
    title: string;
    description: string;
  }[];
  /** CMS-editable contact (no re-deploy needed) */
  email?: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
  section_visibility?: {
    about?: boolean;
    experience?: boolean;
    projects?: boolean;
    blog?: boolean;
    personal?: boolean;
    research?: boolean;
  };
}
