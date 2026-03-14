
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { toast } from 'sonner';
import { useIsSectionVisible } from '@/hooks/useSectionVisibility';

const Blog = () => {
  const visible = useIsSectionVisible('blog');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // Transform data to match our BlogPost type
        const transformedData = data?.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          date: post.date,
          tags: post.tags || [],
          cover_image: post.cover_image
        })) || [];
        
        setBlogPosts(transformedData);
        
        // Extract all unique tags
        const uniqueTags = Array.from(
          new Set(transformedData.flatMap(post => post.tags))
        ).sort();
        
        setAllTags(uniqueTags);
        
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  // Filter posts based on search query and selected tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = activeTag === null || post.tags.includes(activeTag);
    
    return matchesSearch && matchesTag;
  });

  if (!visible) {
    return (
      <Layout>
        <div className="section-container text-center py-16">
          <p className="text-muted-foreground">This section is not available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container">
        <SectionHeader 
          title="Blog" 
          subtitle="Thoughts, ideas, and explorations in mathematics and beyond"
        />

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="md:flex-grow">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTag === null ? 'default' : 'outline'}
              onClick={() => setActiveTag(null)}
              className={activeTag === null ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? 'default' : 'outline'}
                onClick={() => setActiveTag(tag)}
                className={activeTag === tag ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading articles...</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="card overflow-hidden h-full flex flex-col">
                {post.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="tag cursor-pointer"
                        onClick={() => setActiveTag(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-2 text-portfolio-blue dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm mb-3 text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="mt-auto inline-flex items-center text-portfolio-teal hover:text-portfolio-teal/80"
                  >
                    Read Article <ArrowRight size={16} className="ml-2" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button onClick={() => { setSearchQuery(''); setActiveTag(null); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
