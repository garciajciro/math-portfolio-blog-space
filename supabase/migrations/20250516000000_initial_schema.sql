
-- Create profiles table linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table for admin privileges
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles junction table
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Create experience table
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  preview_text TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personal_posts table
CREATE TABLE personal_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  preview_text TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create research_papers table
CREATE TABLE research_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authors TEXT[],
  publication TEXT,
  publication_date DATE,
  abstract TEXT,
  pdf_url TEXT,
  external_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about_data table
CREATE TABLE about_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bio TEXT,
  education TEXT[],
  skills TEXT[],
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('admin'), ('user');

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public profiles are viewable by everyone." ON profiles 
  FOR SELECT USING (true);

CREATE POLICY "Experience entries are viewable by everyone." ON experience
  FOR SELECT USING (true);

CREATE POLICY "Projects are viewable by everyone." ON projects
  FOR SELECT USING (true);

CREATE POLICY "Published blog posts are viewable by everyone." ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Published personal posts are viewable by everyone." ON personal_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Research papers are viewable by everyone." ON research_papers
  FOR SELECT USING (true);

CREATE POLICY "About data is viewable by everyone." ON about_data
  FOR SELECT USING (true);

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1 AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy for admin access
CREATE POLICY "Admins can do all operations on profiles" ON profiles
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can do all operations on experience" ON experience
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can do all operations on projects" ON projects
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can do all operations on blog_posts" ON blog_posts
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can do all operations on personal_posts" ON personal_posts
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can do all operations on research_papers" ON research_papers
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can do all operations on about_data" ON about_data
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Set up storage buckets
-- This will be done through the Supabase dashboard since SQL doesn't handle this directly

-- Create trigger to assign admin role to first user
CREATE OR REPLACE FUNCTION assign_admin_to_first_user()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    INSERT INTO user_roles (user_id, role_id)
    SELECT NEW.id, id FROM roles WHERE name = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER assign_admin_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION assign_admin_to_first_user();
