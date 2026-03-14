
import { useState } from 'react';
import { Project } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Edit, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectForm } from './ProjectForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type ProjectsListProps = {
  projects: Project[];
  onRemove: (id: string) => void;
  onFieldChange: (id: string, field: string, value: any) => void;
  onTechnologiesChange: (id: string, technologies: string[]) => void;
  onAddTechnology: (id: string) => void;
  onRemoveTechnology: (id: string, index: number) => void;
  onUploadComplete: (id: string, urls: string[]) => void;
  onSave: () => void;
  isSaving: boolean;
};

export const ProjectsList = ({ 
  projects,
  onRemove,
  onFieldChange,
  onTechnologiesChange,
  onAddTechnology,
  onRemoveTechnology,
  onUploadComplete,
  onSave,
  isSaving
}: ProjectsListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editModeId, setEditModeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Reset edit mode when collapsing
    if (expandedId === id) {
      setEditModeId(null);
    }
  };

  const toggleEditMode = (id: string) => {
    setEditModeId(editModeId === id ? null : id);
  };

  if (!projects.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No projects found. Create your first project using the Create New tab.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, idx) => (
        <Card key={project.id} className="overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer" 
            onClick={() => toggleExpand(project.id)}
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">{project.title}</h3>
              <Badge variant="outline">{project.category}</Badge>
              {project.featured && <Badge className="bg-portfolio-blue text-white">Featured</Badge>}
            </div>
            <div className="flex items-center gap-2">
              {expandedId === project.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {expandedId === project.id && (
            <CardContent className="border-t pt-4">
              {editModeId === project.id ? (
                <div className="mb-4">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium">Edit Project</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEditMode(project.id);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSave();
                        }}
                        disabled={isSaving}
                        className="flex items-center gap-1"
                      >
                        {isSaving ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Save size={14} />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <ProjectForm
                    key={project.id}
                    project={project}
                    index={idx}
                    onRemove={onRemove}
                    onFieldChange={onFieldChange}
                    onTechnologiesChange={onTechnologiesChange}
                    onAddTechnology={onAddTechnology}
                    onRemoveTechnology={onRemoveTechnology}
                    onUploadComplete={onUploadComplete}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: project.description }} />
                  </div>

                  <div>
                    {project.image && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Project Image</h4>
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full max-w-xs h-auto object-cover rounded-md border" 
                        />
                      </div>
                    )}

                    {project.technologies?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.github && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              GitHub
                            </a>
                          </Button>
                        )}
                        {project.link && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              Live Site
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {editModeId !== project.id && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEditMode(project.id);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Edit Project
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
