
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PersonalPost } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const PersonalPostPage = () => {
  const [post, setPost] = useState<PersonalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const { data, error } = await supabase
          .from('personal_posts')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Transform data to match our PersonalPost type
        const postData = {
          id: data.id,
          title: data.title,
          content: data.content,
          date: data.date,
          type: data.type as PersonalPost['type'],
          image_urls: data.image_urls || []
        };
        
        setPost(postData);
      } catch (error) {
        console.error('Error fetching personal post:', error);
        toast.error('Failed to load personal post');
        navigate('/personal');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPostById();
    }
  }, [id, navigate]);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Function to render content as HTML
  const renderContent = (content: string) => {
    return { __html: content };
  };
  
  return (
    <Layout>
      <div className="section-container">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/personal')}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={16} />
          Back to all posts
        </Button>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading post...</p>
          </div>
        ) : post ? (
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <h1 className="text-3xl font-serif font-semibold mb-4 text-portfolio-blue dark:text-white">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <p className="text-muted-foreground">
                  {formatDate(post.date)}
                </p>
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-portfolio-blue bg-portfolio-blue/10">
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </span>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <div dangerouslySetInnerHTML={renderContent(post.content)} />
              </div>
              
              {post.image_urls && post.image_urls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
                  {post.image_urls.map((url, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Image ${idx + 1} for ${post.title}`} 
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          console.error("Failed to load image:", url);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Post not found</h3>
            <p className="text-muted-foreground mb-4">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/personal')}>
              Back to Personal Posts
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PersonalPostPage;
