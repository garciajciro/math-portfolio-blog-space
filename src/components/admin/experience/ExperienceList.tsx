
import React from 'react';
import { Experience } from '@/types';
import ExperienceForm from './ExperienceForm';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

type ExperienceListProps = {
  experienceItems: Experience[];
  handleRemoveExperience: (id: string) => void;
  updateExperienceField: (id: string, field: keyof Experience, value: any) => void;
  updateHighlights: (id: string, highlights: string[]) => void;
  addHighlight: (id: string) => void;
  removeHighlight: (id: string, index: number) => void;
  updateTechnologies: (id: string, technologies: string[]) => void;
  addTechnology: (id: string) => void;
  removeTechnology: (id: string, index: number) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
};

const ExperienceList: React.FC<ExperienceListProps> = ({
  experienceItems,
  handleRemoveExperience,
  updateExperienceField,
  updateHighlights,
  addHighlight,
  removeHighlight,
  updateTechnologies,
  addTechnology,
  removeTechnology,
  onSave,
  isSaving
}) => {
  if (experienceItems.length === 0) {
    return (
      <div className="text-center p-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground mb-4">No experience items found. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {experienceItems.map((experience, idx) => (
        <ExperienceForm
          key={experience.id}
          experience={experience}
          index={idx}
          onRemove={handleRemoveExperience}
          onUpdateField={updateExperienceField}
          onUpdateHighlights={updateHighlights}
          onAddHighlight={addHighlight}
          onRemoveHighlight={removeHighlight}
          onUpdateTechnologies={updateTechnologies}
          onAddTechnology={addTechnology}
          onRemoveTechnology={removeTechnology}
        />
      ))}
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExperienceList;
