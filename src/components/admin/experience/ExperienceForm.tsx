
import React from 'react';
import { Experience } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Save } from 'lucide-react';
import RichTextEditor from '../../RichTextEditor';

type ExperienceFormProps = {
  experience: Experience;
  index: number;
  onRemove: (id: string) => void;
  onUpdateField: (id: string, field: keyof Experience, value: any) => void;
  onUpdateHighlights: (id: string, highlights: string[]) => void;
  onAddHighlight: (id: string) => void;
  onRemoveHighlight: (id: string, index: number) => void;
  onUpdateTechnologies: (id: string, technologies: string[]) => void;
  onAddTechnology: (id: string) => void;
  onRemoveTechnology: (id: string, index: number) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  index,
  onRemove,
  onUpdateField,
  onUpdateHighlights,
  onAddHighlight,
  onRemoveHighlight,
  onUpdateTechnologies,
  onAddTechnology,
  onRemoveTechnology,
  onSave,
  isSaving = false,
}) => {
  const isExisting = !experience.id.startsWith('exp-');
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
          <div className="flex items-center gap-2">
            {isExisting && onSave && (
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-1"
              >
                <Save size={14} />
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onRemove(experience.id)}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} />
              Remove
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`title-${experience.id}`}>Job Title</Label>
              <Input 
                id={`title-${experience.id}`}
                value={experience.title}
                onChange={(e) => onUpdateField(experience.id, "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`company-${experience.id}`}>Company</Label>
              <Input 
                id={`company-${experience.id}`}
                value={experience.company}
                onChange={(e) => onUpdateField(experience.id, "company", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`location-${experience.id}`}>Location</Label>
              <Input 
                id={`location-${experience.id}`}
                value={experience.location}
                onChange={(e) => onUpdateField(experience.id, "location", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`startDate-${experience.id}`}>Start Date</Label>
              <Input 
                id={`startDate-${experience.id}`}
                type="month"
                value={experience.start_date}
                onChange={(e) => onUpdateField(experience.id, "start_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`endDate-${experience.id}`}>End Date (leave blank for current)</Label>
              <Input 
                id={`endDate-${experience.id}`}
                type="month"
                value={experience.end_date || ""}
                onChange={(e) => onUpdateField(
                  experience.id, 
                  "end_date", 
                  e.target.value ? e.target.value : null
                )}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`description-${experience.id}`}>Description</Label>
            <RichTextEditor
              initialContent={experience.description}
              onChange={(value) => onUpdateField(experience.id, "description", value)}
            />
          </div>

          <div>
            <Label>Highlights</Label>
            {experience.highlights && experience.highlights.map((highlight, hIdx) => (
              <div key={`highlight-${hIdx}`} className="flex items-center gap-2 mb-2">
                <Input 
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...experience.highlights];
                    newHighlights[hIdx] = e.target.value;
                    onUpdateHighlights(experience.id, newHighlights);
                  }}
                  className="flex-1"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onRemoveHighlight(experience.id, hIdx)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onAddHighlight(experience.id)}
              className="flex items-center gap-1 mt-2"
            >
              <Plus size={14} />
              Add Highlight
            </Button>
          </div>

          <div>
            <Label>Technologies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {experience.technologies && experience.technologies.map((tech, tIdx) => (
                <div 
                  key={`tech-${tIdx}`} 
                  className="bg-muted px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <Input 
                    value={tech}
                    onChange={(e) => {
                      const newTechnologies = [...experience.technologies];
                      newTechnologies[tIdx] = e.target.value;
                      onUpdateTechnologies(experience.id, newTechnologies);
                    }}
                    className="w-auto min-w-[100px] border-0 bg-transparent p-0 h-6"
                  />
                  <button 
                    onClick={() => onRemoveTechnology(experience.id, tIdx)}
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
                onClick={() => onAddTechnology(experience.id)}
                className="flex items-center gap-1 h-8"
              >
                <Plus size={14} />
                Add Tech
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;
