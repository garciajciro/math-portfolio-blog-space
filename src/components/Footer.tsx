import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contact, setContact] = useState<{
    name: string | null;
    title: string | null;
    bio: string | null;
    email: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    resume_url: string | null;
  }>({ name: null, title: null, bio: null, email: null, linkedin_url: null, github_url: null, resume_url: null });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('about_data').select('name, title, bio, email, linkedin_url, github_url, resume_url').limit(1).single();
      if (data) setContact(data as any);
    };
    fetch();
  }, []);

  const name = contact.name || 'Juan Garcia';
  const tagline = contact.bio?.split('\n')[0]?.trim() || contact.title || 'Software Engineer';

  return (
    <footer className="bg-muted dark:bg-muted py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">
              {name}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              {(contact.github_url || 'https://github.com/garciajciro') && (
                <a 
                  href={contact.github_url || 'https://github.com/garciajciro'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              )}
              {(contact.linkedin_url || 'https://www.linkedin.com/in/juan-garcia-31a601204/') && (
                <a 
                  href={contact.linkedin_url || 'https://www.linkedin.com/in/juan-garcia-31a601204/'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {(contact.email || 'mailto:cirojuanj@gmail.com') && (
                <a 
                  href={contact.email ? `mailto:${contact.email}` : 'mailto:cirojuanj@gmail.com'}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              )}
              {contact.resume_url && (
                <a 
                  href={contact.resume_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Resume"
                >
                  <FileText size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">
              Professional
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/experience" className="text-muted-foreground hover:text-foreground transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground hover:text-foreground transition-colors">
                  Research
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">
              Personal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/personal" className="text-muted-foreground hover:text-foreground transition-colors">
                  Personal Space
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-muted-foreground text-center">
            &copy; {currentYear} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
