
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ExperienceActionBarProps = {
  onAddExperience: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
};

const ExperienceActionBar: React.FC<ExperienceActionBarProps> = ({ 
  onAddExperience, 
  onSave, 
  isSaving 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onAddExperience}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Add New Experience
      </Button>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
        >
          Cancel
        </Button>
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

export default ExperienceActionBar;
