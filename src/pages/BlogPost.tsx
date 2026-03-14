
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType } from '../types';
import { toast } from 'sonner';

// Function to convert markdown-style content to React components
const renderMarkdown = (content: string): JSX.Element[] => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-3xl font-serif font-bold mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-2xl font-serif font-semibold mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-xl font-serif font-semibold mb-3">{line.slice(4)}</h3>);
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const codeLines = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('```')) {
        codeLines.push(lines[j]);
        j++;
      }
      if (j < lines.length) {
        elements.push(
          <pre key={key++} className="bg-muted p-4 rounded-md overflow-auto mb-6">
            <code className="font-mono text-sm">{codeLines.join('\n')}</code>
          </pre>
        );
        i = j;
      }
    }
    // Lists
    else if (line.match(/^\d+\. /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(
          <li key={`li-${i}`} className="mb-2">
            {lines[i].replace(/^\d+\. /, '')}
          </li>
        );
        i++;
      }
      elements.push(<ol key={key++} className="list-decimal list-inside mb-6 pl-4">{listItems}</ol>);
      i--;
    } else if (line.startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(
          <li key={`li-${i}`} className="mb-2">
            {lines[i].slice(2)}
          </li>
        );
        i++;
      }
      elements.push(<ul key={key++} className="list-disc list-inside mb-6 pl-4">{listItems}</ul>);
      i--;
    }
    // Regular paragraph
    else if (line.trim() !== '') {
      elements.push(<p key={key++} className="mb-4 text-muted-foreground">{line}</p>);
    }
    // Empty line (spacing)
    else {
      elements.push(<div key={key++} className="h-4"></div>);
    }
  }

  return elements;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Fetch the current blog post
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (postError) throw postError;
        
        if (!postData) {
          navigate('/blog');
          return;
        }
        
        const currentPost: BlogPostType = {
          id: postData.id,
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt || '',
          content: postData.content,
          date: postData.date,
          tags: postData.tags || [],
          cover_image: postData.cover_image
        };
        
        setPost(currentPost);
        
        // Fetch related posts based on tags
        if (currentPost.tags && currentPost.tags.length > 0) {
          // We use .or to search for posts that have any of the current post's tags
          let query = supabase
            .from('blog_posts')
            .select('*')
            .neq('id', currentPost.id)
            .limit(2);
          
          // Filter to find posts that contain any of the current post's tags
          const { data: relatedData, error: relatedError } = await query;
          
          if (relatedError) throw relatedError;
          
          const transformedRelated = relatedData?.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            date: post.date,
            tags: post.tags || [],
            cover_image: post.cover_image
          })) || [];
          
          // Filter on the client side to find posts that share tags
          const filtered = transformedRelated.filter(
            rPost => rPost.tags.some(tag => currentPost.tags.includes(tag))
          );
          
          setRelatedPosts(filtered.slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Failed to load blog post');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug, navigate]);
  
  if (loading) {
    return (
      <Layout>
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return null;
  }
  
  return (
    <Layout>
      <div className="section-container max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Blog
            </Button>
          </Link>
        </div>
        
        {/* Article Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-portfolio-blue dark:text-white">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <p className="text-muted-foreground">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/blog?tag=${tag}`}>
                  <span className="tag">{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-12">
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        
        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {renderMarkdown(post.content)}
        </div>
        
        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-2xl font-serif font-semibold mb-6 text-portfolio-blue dark:text-white">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <div className="p-4 bg-card rounded-lg transition-shadow hover:shadow-md">
                    <h4 className="font-serif font-semibold text-lg mb-2 group-hover:text-portfolio-teal transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm mb-2 text-muted-foreground">
                      {new Date(relatedPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogPost;
