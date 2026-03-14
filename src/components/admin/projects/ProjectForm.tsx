
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import RichTextEditor from '../../../components/RichTextEditor';
import { Project } from '../../../types';
import { ProjectLinks } from './ProjectLinks';
import { ProjectImage } from './ProjectImage';
import { ProjectTechnologies } from './ProjectTechnologies';

type ProjectFormProps = {
  project: Project;
  index: number;
  onRemove: (id: string) => void;
  onFieldChange: (id: string, field: string, value: any) => void;
  onTechnologiesChange: (id: string, technologies: string[]) => void;
  onAddTechnology: (id: string) => void;
  onRemoveTechnology: (id: string, index: number) => void;
  onUploadComplete: (id: string, urls: string[]) => void;
};

const projectCategories = ["academic", "web", "mobile", "other"];

export const ProjectForm = ({
  project,
  index,
  onRemove,
  onFieldChange,
  onTechnologiesChange,
  onAddTechnology,
  onRemoveTechnology,
  onUploadComplete
}: ProjectFormProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Project #{index + 1}</h3>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onRemove(project.id)}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Remove
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`title-${project.id}`}>Project Title</Label>
              <Input 
                id={`title-${project.id}`}
                value={project.title}
                onChange={(e) => onFieldChange(project.id, "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`category-${project.id}`}>Category</Label>
              <Select 
                value={project.category} 
                onValueChange={(value) => onFieldChange(project.id, "category", value)}
              >
                <SelectTrigger id={`category-${project.id}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {projectCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor={`description-${project.id}`}>Description</Label>
            <RichTextEditor
              initialContent={project.description}
              onChange={(value) => onFieldChange(project.id, "description", value)}
            />
          </div>

          <ProjectLinks project={project} onFieldChange={onFieldChange} />

          <ProjectImage project={project} onUploadComplete={onUploadComplete} />

          <div className="flex items-center gap-2">
            <Label htmlFor={`featured-${project.id}`}>Featured Project</Label>
            <input
              type="checkbox"
              id={`featured-${project.id}`}
              checked={project.featured}
              onChange={(e) => onFieldChange(project.id, "featured", e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <ProjectTechnologies 
            project={project} 
            technologies={project.technologies}
            onTechnologiesChange={onTechnologiesChange}
            onAddTechnology={onAddTechnology}
            onRemoveTechnology={onRemoveTechnology}
          />
        </div>
      </CardContent>
    </Card>
  );
};
