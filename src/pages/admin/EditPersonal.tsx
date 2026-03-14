import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trash2, Plus, ImageIcon, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import MediaUpload from '@/components/MediaUpload';
import { PersonalPost } from '@/types';
import CollapsibleAdminItem from '@/components/admin/CollapsibleAdminItem';
import { ProjectsActionBar } from '@/components/admin/projects/ProjectsActionBar';

const EditPersonal = () => {
  const [posts, setPosts] = useState<PersonalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PersonalPost | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'story' | 'update' | 'thought'>('story');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load personal posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('personal_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Convert type field to ensure it matches our PersonalPost type
        const typedPosts = data?.map(post => ({
          ...post,
          type: post.type as 'story' | 'update' | 'thought',
          image_urls: post.image_urls || []
        })) || [];
        
        setPosts(typedPosts);
      } catch (error) {
        console.error('Error fetching personal posts:', error);
        toast.error('Failed to fetch personal posts.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Set the form values when a post is selected
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title);
      setContent(selectedPost.content);
      setType(selectedPost.type);
      setImageUrls(selectedPost.image_urls || []);
    } else {
      // Clear the form when no post is selected
      setTitle('');
      setContent('');
      setType('story');
      setImageUrls([]);
    }
  }, [selectedPost]);

  const handleCreateNew = () => {
    setSelectedPost(null);
    setEditMode(null);
    // Switch to create post tab
    const tabsList = document.querySelector('[value="createPost"]') as HTMLButtonElement;
    if (tabsList) tabsList.click();
  };

  const handlePostSelect = (post: PersonalPost) => {
    // Toggle selection - if the same post is clicked again, deselect it
    setSelectedPost(prevSelected => prevSelected?.id === post.id ? null : post);
  };

  const handleToggleEdit = (postId: string) => {
    setEditMode(editMode === postId ? null : postId);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!title.trim()) {
        toast.error('Title is required.');
        setSaving(false);
        return;
      }

      const postData = {
        title: title.trim(),
        content: content.trim() || '',
        type,
        date: selectedPost?.date || new Date().toISOString().split('T')[0],
        image_urls: imageUrls.length > 0 ? imageUrls : null,
      };

      if (selectedPost && editMode) {
        // Update existing post
        const { error } = await supabase
          .from('personal_posts')
          .update(postData)
          .eq('id', selectedPost.id);

        if (error) throw error;

        setPosts(prevPosts => 
          prevPosts.map(p => p.id === selectedPost.id ? { ...p, ...postData } : p)
        );

        toast.success('Personal post updated successfully');
        
        // Exit edit mode after successful update
        setEditMode(null);
      } else if (!selectedPost) {
        // Create new post
        const { data, error } = await supabase
          .from('personal_posts')
          .insert([postData])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          // Cast the type to ensure it matches our PersonalPost type
          const newPost = {
            ...data[0],
            type: data[0].type as 'story' | 'update' | 'thought',
            image_urls: data[0].image_urls || []
          } as PersonalPost;
          
          setPosts(prevPosts => [newPost, ...prevPosts]);
        }

        toast.success('Personal post created successfully');
        
        // Clear form after creating
        setTitle('');
        setContent('');
        setType('story');
        setImageUrls([]);
      }
    } catch (error: any) {
      console.error('Error saving personal post:', error);
      toast.error(`Failed to save personal post: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      const { error } = await supabase
        .from('personal_posts')
        .delete()
        .eq('id', selectedPost.id);

      if (error) throw error;

      setPosts(prevPosts => prevPosts.filter(p => p.id !== selectedPost.id));
      setSelectedPost(null);
      setEditMode(null);
      
      toast.success('Personal post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting personal post:', error);
      toast.error(`Failed to delete personal post: ${error.message || 'Unknown error'}`);
    }
  };

  const handleMediaUploadComplete = (urls: string[]) => {
    setImageUrls(prev => [...prev, ...urls]);
    setShowMediaUpload(false);
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Function to delete images from storage
  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      // Extract filename from the URL
      const urlParts = imageUrl.split('/');
      const bucketName = 'personal-images';
      
      // The path should be everything after the bucket name in the URL
      const bucketIndex = urlParts.findIndex(part => part === bucketName);
      if (bucketIndex === -1) {
        console.error("Could not parse file path from URL:", imageUrl);
        toast.error('Failed to delete image: Could not determine file path');
        return false;
      }
      
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      console.log(`Attempting to delete file: ${bucketName}/${filePath}`);
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) {
        console.error("Error deleting image:", error);
        toast.error(`Failed to delete image: ${error.message}`);
        return false;
      }
      
      toast.success('Image deleted successfully');
      return true;
    } catch (error: any) {
      console.error("Error in delete handler:", error);
      toast.error(`An unexpected error occurred: ${error.message}`);
      return false;
    }
  };

  return (
    <AdminLayout title="Personal Posts Management">
      <Tabs defaultValue="allPosts" className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="allPosts">All Posts</TabsTrigger>
          <TabsTrigger value="createPost">Create New Post</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allPosts">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Personal Posts</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-portfolio-orange rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center p-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-4">No personal posts found. Create your first post!</p>
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
                    subtitle={
                      <div className="flex gap-2">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-muted capitalize">
                          {post.type}
                        </span>
                      </div>
                    }
                    isSelected={selectedPost?.id === post.id}
                    onSelect={() => handlePostSelect(post)}
                    onEdit={() => handleToggleEdit(post.id)}
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
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                              value={type}
                              onChange={(e) => setType(e.target.value as 'story' | 'update' | 'thought')}
                              className="w-full p-2 border rounded-md bg-background"
                            >
                              <option value="story">Story</option>
                              <option value="update">Update</option>
                              <option value="thought">Thought</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Content</label>
                          <RichTextEditor
                            initialContent={content}
                            onChange={setContent}
                            placeholder="Write your content here..."
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">Images</label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowMediaUpload(!showMediaUpload)}
                              className="flex items-center"
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              {showMediaUpload ? 'Hide Upload' : 'Add Images'}
                            </Button>
                          </div>
                          
                          {showMediaUpload && (
                            <div className="mb-4 p-4 border rounded-md bg-muted/20">
                              <MediaUpload
                                bucketName="personal-images"
                                onUploadComplete={handleMediaUploadComplete}
                              />
                            </div>
                          )}
                          
                          {imageUrls.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                              {imageUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                  <img 
                                    src={url} 
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                    onError={(e) => {
                                      console.error("Failed to load image:", url);
                                      e.currentTarget.src = '/placeholder.svg';
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
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
                            <h4 className="font-medium mb-2">Content</h4>
                            <div 
                              className="text-sm text-muted-foreground overflow-auto max-h-40 border p-2 rounded-md"
                              dangerouslySetInnerHTML={{ __html: post.content }}
                            ></div>
                          </div>
                          
                          <div>
                            {post.image_urls && post.image_urls.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Images</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {post.image_urls.slice(0, 4).map((url, index) => (
                                    <img
                                      key={index}
                                      src={url}
                                      alt={`Image ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-md"
                                    />
                                  ))}
                                  {post.image_urls.length > 4 && (
                                    <div className="bg-muted flex items-center justify-center rounded-md h-24">
                                      +{post.image_urls.length - 4} more
                                    </div>
                                  )}
                                </div>
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
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'story' | 'update' | 'thought')}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="story">Story</option>
                  <option value="update">Update</option>
                  <option value="thought">Thought</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <RichTextEditor
                initialContent={content}
                onChange={setContent}
                placeholder="Write your content here..."
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Images</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowMediaUpload(!showMediaUpload)}
                  className="flex items-center"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {showMediaUpload ? 'Hide Upload' : 'Add Images'}
                </Button>
              </div>
              
              {showMediaUpload && (
                <div className="mb-4 p-4 border rounded-md bg-muted/20">
                  <MediaUpload
                    bucketName="personal-images"
                    onUploadComplete={handleMediaUploadComplete}
                  />
                </div>
              )}
              
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          console.error("Failed to load image:", url);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <ProjectsActionBar
                onAddProject={handleCreateNew}
                onSave={handleSave}
                isSaving={saving}
                createButtonText="Add New Personal Post"
                showSaveButtons={true}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default EditPersonal;
