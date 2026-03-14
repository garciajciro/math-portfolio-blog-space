
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PersonalPost } from '../types';
import { toast } from 'sonner';
import { useIsSectionVisible } from '@/hooks/useSectionVisibility';

type PostTypeFilter = 'all' | PersonalPost['type'];

const Personal = () => {
  const visible = useIsSectionVisible('personal');
  const [activeFilter, setActiveFilter] = useState<PostTypeFilter>('all');
  const [personalPosts, setPersonalPosts] = useState<PersonalPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPersonalPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('personal_posts')
          .select('*')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // Transform data to match our PersonalPost type
        const transformedData = data?.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          date: post.date,
          type: post.type as PersonalPost['type'],
          image_urls: post.image_urls || []
        })) || [];
        
        setPersonalPosts(transformedData);
      } catch (error) {
        console.error('Error fetching personal posts:', error);
        toast.error('Failed to load personal posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersonalPosts();
  }, []);
  
  const filteredPosts = activeFilter === 'all' 
    ? personalPosts 
    : personalPosts.filter(post => post.type === activeFilter);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Function to convert content to paragraphs
  const renderContent = (content: string) => {
    // Only show first 300 characters
    if (content.length > 300) {
      const truncatedContent = content.substring(0, 300).split('\n')[0];
      return <p>{truncatedContent}...</p>;
    }
    
    return content.split('\n').map((paragraph, idx) => (
      paragraph.startsWith('#') ? null : <p key={idx} className="mb-3">{paragraph}</p>
    ));
  };
  
  // Extract title from content
  const extractTitle = (content: string): string => {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return line.substring(2);
      }
    }
    return '';
  };

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
          title="Personal Space" 
          subtitle="Stories, thoughts, and updates from my life beyond academics"
        />
        
        {/* Type Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            className={activeFilter === 'all' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            All Posts
          </Button>
          <Button 
            variant={activeFilter === 'story' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('story')}
            className={activeFilter === 'story' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            Stories
          </Button>
          <Button 
            variant={activeFilter === 'update' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('update')}
            className={activeFilter === 'update' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            Updates
          </Button>
          <Button 
            variant={activeFilter === 'thought' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('thought')}
            className={activeFilter === 'thought' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            Thoughts
          </Button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading posts...</p>
          </div>
        )}
        
        {/* Posts Grid/List */}
        {!loading && (
          <div className="space-y-8">
            {filteredPosts.map((post) => {
              const postTitle = post.title || extractTitle(post.content);
              
              return (
                <Card key={post.id} className="card overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif font-semibold mb-2 text-portfolio-blue dark:text-white">
                      {postTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <p className="text-muted-foreground">
                        {formatDate(post.date)}
                      </p>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-portfolio-blue bg-portfolio-blue/10">
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </span>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-6 text-muted-foreground">
                      {renderContent(post.content)}
                    </div>
                    
                    {post.image_urls && post.image_urls.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {post.image_urls.map((url, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden">
                            <img 
                              src={url} 
                              alt={`Image ${idx + 1} for ${postTitle}`} 
                              className="w-full h-auto"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Link to={`/personal/${post.id}`}>
                      <Button variant="outline" size="sm">
                        Read Full Post
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              No posts match the selected filter. Try another category.
            </p>
            <Button onClick={() => setActiveFilter('all')}>
              View All Posts
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Personal;
