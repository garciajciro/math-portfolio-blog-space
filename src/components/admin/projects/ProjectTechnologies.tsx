
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Project } from '../../../types';
import { Plus } from 'lucide-react';

type ProjectTechnologiesProps = {
  project: Project;
  technologies: string[];
  onTechnologiesChange: (id: string, technologies: string[]) => void;
  onAddTechnology: (id: string) => void;
  onRemoveTechnology: (id: string, index: number) => void;
};

export const ProjectTechnologies = ({ 
  project, 
  technologies, 
  onTechnologiesChange, 
  onAddTechnology, 
  onRemoveTechnology 
}: ProjectTechnologiesProps) => {
  return (
    <div>
      <Label>Technologies</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {technologies.map((tech, tIdx) => (
          <div 
            key={`tech-${tIdx}`} 
            className="bg-muted px-3 py-1 rounded-full flex items-center gap-2"
          >
            <Input 
              value={tech}
              onChange={(e) => {
                const newTechnologies = [...technologies];
                newTechnologies[tIdx] = e.target.value;
                onTechnologiesChange(project.id, newTechnologies);
              }}
              className="w-auto min-w-[100px] border-0 bg-transparent p-0 h-6"
            />
            <button 
              onClick={() => onRemoveTechnology(project.id, tIdx)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        ))}
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => onAddTechnology(project.id)}
          className="flex items-center gap-1 h-8"
        >
          <Plus size={14} />
          Add Tech
        </Button>
      </div>
    </div>
  );
};
