import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import RichTextEditor from '@/components/RichTextEditor';
import CollapsibleAdminItem from '@/components/admin/CollapsibleAdminItem';
import { ProjectsActionBar } from '@/components/admin/projects/ProjectsActionBar';
import MediaUpload from '@/components/MediaUpload';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover_image?: string;
  date: string;
}

const EditBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch blog posts.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [toast]);

  // Set the form values when a post is selected
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title);
      setSlug(selectedPost.slug);
      setExcerpt(selectedPost.excerpt || '');
      setContent(selectedPost.content);
      setTagsInput(selectedPost.tags?.join(', ') || '');
      setCoverImage(selectedPost.cover_image || '');
    } else {
      // Clear the form when no post is selected
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setTagsInput('');
      setCoverImage('');
    }
  }, [selectedPost]);

  const handleCreateNew = () => {
    setSelectedPost(null);
    setEditMode(null);
    // Switch to create post tab
    const tabsList = document.querySelector('[value="createPost"]') as HTMLButtonElement;
    if (tabsList) tabsList.click();
  };

  const handlePostSelect = (post: BlogPost) => {
    setSelectedPost(prevSelected => prevSelected?.id === post.id ? null : post);
  };

  const handleSelectAndEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setEditMode(post.id);
  };

  const handleToggleEdit = (postId: string) => {
    setEditMode(editMode === postId ? null : postId);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!title.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Title is required.',
          variant: 'destructive',
        });
        setSaving(false);
        return;
      }

      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      const slugValue = slug.trim() || title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const postData = {
        title: title.trim(),
        slug: slugValue,
        excerpt: excerpt.trim() || null,
        content: content.trim() || '',
        tags,
        cover_image: coverImage.trim() || null,
        date: new Date().toISOString().split('T')[0],
      };

      if (selectedPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', selectedPost.id);

        if (error) throw error;

        setPosts(prevPosts => 
          prevPosts.map(p => p.id === selectedPost.id ? { ...p, ...postData } : p)
        );

        toast({
          title: 'Success',
          description: 'Blog post updated successfully',
        });
        
        // If we're in inline editing mode, exit edit mode
        if (editMode) {
          setEditMode(null);
        }
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setPosts(prevPosts => [data[0] as BlogPost, ...prevPosts]);
        }

        toast({
          title: 'Success',
          description: 'Blog post created successfully',
        });
      }

      // Clear selection if it was a new post
      if (!selectedPost) {
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent('');
        setTagsInput('');
        setCoverImage('');
      }
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error',
        description: `Failed to save blog post: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', selectedPost.id);

      if (error) throw error;

      setPosts(prevPosts => prevPosts.filter(p => p.id !== selectedPost.id));
      setSelectedPost(null);
      setEditMode(null);
      
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Error',
        description: `Failed to delete blog post: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleTabChange = (value: string) => {
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout title="Blog Management">
      <Tabs defaultValue="allPosts" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="allPosts">All Posts</TabsTrigger>
          <TabsTrigger value="createPost">Create New Post</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allPosts">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Blog Posts</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-portfolio-orange rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center p-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-4">No blog posts found. Create your first post!</p>
                  <Button onClick={() => {
                    setSelectedPost(null);
                    const tabsList = document.querySelector('[value="createPost"]') as HTMLButtonElement;
                    if (tabsList) tabsList.click();
                  }}>
                    <Plus size={16} className="mr-2" />
                    Add First Post
                  </Button>
                </div>
              ) : (
                posts.map(post => (
                  <CollapsibleAdminItem
                    key={post.id}
                    title={post.title}
                    subtitle={new Date(post.date).toLocaleDateString()}
                    badges={post.tags?.map(tag => (
                      <span key={tag} className="bg-muted px-2 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    isSelected={selectedPost?.id === post.id}
                    onSelect={() => handlePostSelect(post)}
                    onEdit={() => handleSelectAndEdit(post)}
                    onDelete={() => handleDelete()}
                  >
                    {editMode === post.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                              placeholder="Post title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input
                              type="text"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                              placeholder="post-url-slug"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Excerpt</label>
                          <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background"
                            rows={2}
                            placeholder="Brief summary of the post"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background"
                            placeholder="mathematics, philosophy, research"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Cover Image</label>
                          <input
                            type="text"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background mb-2"
                            placeholder="Paste URL or upload below"
                          />
                          <MediaUpload
                            bucketName="blog-images"
                            folder="covers"
                            onUploadComplete={(urls) => urls[0] && setCoverImage(urls[0])}
                            maxFiles={1}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Content (optional)</label>
                          <RichTextEditor
                            initialContent={content}
                            onChange={setContent}
                            placeholder="Write your post content here..."
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-1"
                          >
                            <Save size={14} />
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Excerpt</h4>
                            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                            
                            <h4 className="font-medium mt-4 mb-2">Content</h4>
                            <div 
                              className="text-sm text-muted-foreground overflow-auto max-h-40 border p-2 rounded-md"
                              dangerouslySetInnerHTML={{ __html: post.content }}
                            ></div>
                          </div>
                          
                          <div>
                            {post.cover_image && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Cover Image</h4>
                                <img
                                  src={post.cover_image}
                                  alt={post.title}
                                  className="w-full max-w-xs h-auto object-cover rounded-md border"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CollapsibleAdminItem>
                ))
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="createPost" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Create New Post</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="post-url-slug"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                rows={2}
                placeholder="Brief summary of the post"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                placeholder="mathematics, philosophy, research"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image (optional)</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-2 border rounded-md bg-background mb-2"
                placeholder="Paste URL or upload below"
              />
              <MediaUpload
                bucketName="blog-images"
                folder="covers"
                onUploadComplete={(urls) => urls[0] && setCoverImage(urls[0])}
                maxFiles={1}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Content (optional)</label>
              <RichTextEditor
                initialContent={content}
                onChange={setContent}
                placeholder="Write your post content here..."
              />
            </div>
            
            <div className="flex justify-end">
              <ProjectsActionBar
                onAddProject={handleCreateNew}
                onSave={handleSave}
                isSaving={saving}
                createButtonText="Add New Blog Post"
                showSaveButtons={true}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default EditBlog;
