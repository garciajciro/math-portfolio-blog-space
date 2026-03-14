
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ResearchPaper } from '../types';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useIsSectionVisible } from '@/hooks/useSectionVisibility';

type StatusFilter = 'all' | ResearchPaper['status'];

const Research = () => {
  const visible = useIsSectionVisible('research');
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        const { data, error } = await supabase
          .from('research_papers')
          .select('*')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // Transform data to match our ResearchPaper type
        const transformedData = data?.map(paper => ({
          id: paper.id,
          title: paper.title,
          abstract: paper.abstract,
          authors: paper.authors || [],
          date: paper.date,
          journal: paper.journal,
          link: paper.link,
          pdf_url: paper.pdf_url,
          status: paper.status as ResearchPaper['status']
        })) || [];
        
        setResearchPapers(transformedData);
      } catch (error) {
        console.error('Error fetching research papers:', error);
        toast.error('Failed to load research papers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResearchPapers();
  }, []);
  
  const filteredPapers = activeFilter === 'all' 
    ? researchPapers 
    : researchPapers.filter(paper => paper.status === activeFilter);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };
  
  const getStatusLabel = (status: ResearchPaper['status']): string => {
    switch (status) {
      case 'published': return 'Published';
      case 'preprint': return 'Preprint';
      case 'submitted': return 'Submitted';
      case 'draft': return 'Draft';
      default: return status;
    }
  };
  
  const getStatusColor = (status: ResearchPaper['status']): string => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'preprint': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'submitted': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
      case 'draft': return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
      default: return '';
    }
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
          title="Research Papers" 
          subtitle="My academic publications and ongoing research work"
        />
        
        {/* Status Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            className={activeFilter === 'all' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            All Papers
          </Button>
          <Button 
            variant={activeFilter === 'published' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('published')}
            className={activeFilter === 'published' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            Published
          </Button>
          <Button 
            variant={activeFilter === 'preprint' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('preprint')}
            className={activeFilter === 'preprint' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            Preprints
          </Button>
          <Button 
            variant={activeFilter === 'submitted' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('submitted')}
            className={activeFilter === 'submitted' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            Submitted
          </Button>
          <Button 
            variant={activeFilter === 'draft' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('draft')}
            className={activeFilter === 'draft' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
          >
            Draft
          </Button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading papers...</p>
          </div>
        )}
        
        {/* Papers List */}
        {!loading && (
          <div className="space-y-8">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} id={paper.id} className="card">
                <CardContent className="p-8">
                  <div className="flex justify-between flex-wrap gap-4 mb-2">
                    <h3 className="text-2xl font-serif font-semibold text-portfolio-blue dark:text-white">
                      {paper.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(paper.status)}`}>
                      {getStatusLabel(paper.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <FileText size={16} />
                    <span>{formatDate(paper.date)}</span>
                    {paper.journal && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{paper.journal}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {paper.abstract}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Authors</h4>
                    <p className="text-muted-foreground">
                      {paper.authors.join(', ')}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {paper.link && (
                      <a href={paper.link} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          View Publication
                        </Button>
                      </a>
                    )}
                    
                    {paper.pdf_url && (
                      <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download size={16} />
                          Download PDF
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!loading && filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No papers found</h3>
            <p className="text-muted-foreground mb-4">
              No papers match the selected filter. Try another category.
            </p>
            <Button onClick={() => setActiveFilter('all')}>
              View All Papers
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Research;
