
export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Role = {
  id: string;
  name: 'admin' | 'user';
  created_at: string;
};

export type UserRole = {
  user_id: string;
  role_id: string;
  created_at: string;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  skills: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[] | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  preview_text: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export type PersonalPost = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'story' | 'update' | 'thought';
  image_urls: string[] | null;
  created_at: string;
  updated_at: string;
  slug?: string;
  preview_text?: string | null;
  published?: boolean;
  published_at?: string | null;
  tags?: string[] | null;
};

export type ResearchPaper = {
  id: string;
  title: string;
  authors: string[] | null;
  publication: string | null;
  publication_date: string | null;
  abstract: string | null;
  pdf_url: string | null;
  external_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  status: 'published' | 'submitted' | 'preprint' | 'draft';
  journal: string | null;
  date: string;
  link: string | null;
};

export type AboutData = {
  id: string;
  bio: string | null;
  education: string[] | null;
  skills: string[] | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
};
