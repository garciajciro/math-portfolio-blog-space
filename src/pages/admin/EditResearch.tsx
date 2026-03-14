import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleAdminItem from '@/components/admin/CollapsibleAdminItem';
import { ProjectsActionBar } from '@/components/admin/projects/ProjectsActionBar';

// Updated interface to match the database schema
interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  date: string;
  journal: string | null;
  link?: string | null;
  pdf_url?: string | null;
  tags?: string[];
  status: string;
  created_at?: string;
  updated_at?: string;
}

const EditResearch = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [journal, setJournal] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [link, setLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('published');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load research papers
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data, error } = await supabase
          .from('research_papers')
          .select('*')
          .order('date', { ascending: false })
          .order('title');
        
        if (error) throw error;
        
        setPapers(data as ResearchPaper[] || []);
      } catch (error) {
        console.error('Error fetching research papers:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch research papers.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPapers();
  }, [toast]);

  // Set the form values when a paper is selected
  useEffect(() => {
    if (selectedPaper) {
      setTitle(selectedPaper.title);
      setAuthors(selectedPaper.authors?.join(', ') || '');
      setAbstract(selectedPaper.abstract || '');
      setJournal(selectedPaper.journal || '');
      setDate(selectedPaper.date);
      setLink(selectedPaper.link || '');
      setTagsInput(selectedPaper.tags?.join(', ') || '');
      setStatus(selectedPaper.status || 'published');
    } else {
      // Clear the form when no paper is selected
      setTitle('');
      setAuthors('');
      setAbstract('');
      setJournal('');
      setDate(new Date().toISOString().split('T')[0]);
      setLink('');
      setTagsInput('');
      setStatus('published');
    }
  }, [selectedPaper]);

  const handleCreateNew = () => {
    setSelectedPaper(null);
    setEditMode(null);
  };

  const handlePaperSelect = (paper: ResearchPaper) => {
    setSelectedPaper(prevSelected => prevSelected?.id === paper.id ? null : paper);
  };

  const handleToggleEdit = (paperId: string) => {
    setEditMode(editMode === paperId ? null : paperId);
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
      const authorsList = authors.split(',').map(author => author.trim()).filter(author => author);
      
      const paperData = {
        title,
        authors: authorsList,
        abstract,
        journal,
        date,
        link: link || null,
        tags,
        status: status || 'published',
      };

      if (selectedPaper && editMode) {
        // Update existing paper
        const { error } = await supabase
          .from('research_papers')
          .update(paperData)
          .eq('id', selectedPaper.id);

        if (error) throw error;

        setPapers(prevPapers => 
          prevPapers.map(p => p.id === selectedPaper.id ? { ...p, ...paperData } : p)
        );

        toast({
          title: 'Success',
          description: 'Research paper updated successfully',
        });
        
        // Exit edit mode after successful update
        setEditMode(null);
      } else if (!selectedPaper) {
        // Create new paper
        const { data, error } = await supabase
          .from('research_papers')
          .insert([paperData])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setPapers(prevPapers => [...prevPapers, data[0] as ResearchPaper].sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return a.title.localeCompare(b.title);
          }));
        }

        toast({
          title: 'Success',
          description: 'Research paper created successfully',
        });
        
        // Clear form after creating
        setTitle('');
        setAuthors('');
        setAbstract('');
        setJournal('');
        setDate(new Date().toISOString().split('T')[0]);
        setLink('');
        setTagsInput('');
        setStatus('published');
      }
    } catch (error: any) {
      console.error('Error saving research paper:', error);
      toast({
        title: 'Error',
        description: `Failed to save research paper: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPaper) return;

    try {
      const { error } = await supabase
        .from('research_papers')
        .delete()
        .eq('id', selectedPaper.id);

      if (error) throw error;

      setPapers(prevPapers => prevPapers.filter(p => p.id !== selectedPaper.id));
      setSelectedPaper(null);
      setEditMode(null);
      
      toast({
        title: 'Success',
        description: 'Research paper deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting research paper:', error);
      toast({
        title: 'Error',
        description: `Failed to delete research paper: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout title="Research Papers Management">
      <Tabs defaultValue="allPapers" className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="allPapers">All Papers</TabsTrigger>
          <TabsTrigger value="createPaper">Create New Paper</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allPapers">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Research Papers</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-portfolio-orange rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {papers.length === 0 ? (
                <div className="text-center p-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-4">No research papers found. Add your first paper!</p>
                  <Button onClick={() => {
                    setSelectedPaper(null);
                    const tabsList = document.querySelector('[value="createPaper"]') as HTMLButtonElement;
                    if (tabsList) tabsList.click();
                  }}>
                    <Plus size={16} className="mr-2" />
                    Add First Paper
                  </Button>
                </div>
              ) : (
                papers.map(paper => (
                  <CollapsibleAdminItem
                    key={paper.id}
                    title={paper.title}
                    subtitle={
                      <div className="flex gap-2">
                        <span>{paper.date}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{paper.journal}</span>
                      </div>
                    }
                    badges={paper.tags?.map(tag => (
                      <span key={tag} className="bg-muted px-2 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    isSelected={selectedPaper?.id === paper.id}
                    onSelect={() => handlePaperSelect(paper)}
                    onEdit={() => handleToggleEdit(paper.id)}
                    onDelete={() => handleDelete()}
                  >
                    {editMode === paper.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                              placeholder="Paper title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Journal/Publication</label>
                            <input
                              type="text"
                              value={journal}
                              onChange={(e) => setJournal(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                              placeholder="Journal or conference"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Authors (comma separated)</label>
                            <input
                              type="text"
                              value={authors}
                              onChange={(e) => setAuthors(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                              placeholder="John Doe, Jane Smith"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                              type="date"
                              value={date.split('T')[0]} 
                              onChange={(e) => setDate(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Abstract</label>
                          <textarea
                            value={abstract}
                            onChange={(e) => setAbstract(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background"
                            rows={4}
                            placeholder="Paper abstract..."
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Link</label>
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => setLink(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                              placeholder="https://example.com/paper"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                            <input
                              type="text"
                              value={tagsInput}
                              onChange={(e) => setTagsInput(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                              placeholder="mathematics, research"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                            >
                              <option value="published">Published</option>
                              <option value="submitted">Submitted</option>
                              <option value="preprint">Preprint</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>
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
                            <h4 className="font-medium mb-2">Authors</h4>
                            <p className="text-sm text-muted-foreground">
                              {paper.authors?.join(', ')}
                            </p>
                            
                            <h4 className="font-medium mt-4 mb-2">Abstract</h4>
                            <p className="text-sm text-muted-foreground">
                              {paper.abstract || "No abstract provided."}
                            </p>
                          </div>
                          
                          <div>
                            {paper.link && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Link</h4>
                                <a 
                                  href={paper.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                >
                                  {paper.link}
                                </a>
                              </div>
                            )}
                            
                            <h4 className="font-medium mb-2">Status</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {paper.status}
                            </p>
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
        
        <TabsContent value="createPaper" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Create New Paper</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="Paper title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Journal/Publication</label>
                <input
                  type="text"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="Journal or conference"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Authors (comma separated)</label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="John Doe, Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Abstract</label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                rows={4}
                placeholder="Paper abstract..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="https://example.com/paper"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="mathematics, research"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="published">Published</option>
                  <option value="submitted">Submitted</option>
                  <option value="preprint">Preprint</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            
            <ProjectsActionBar
              onAddProject={handleCreateNew}
              onSave={handleSave}
              isSaving={saving}
              createButtonText="Add New Paper"
            />
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default EditResearch;
