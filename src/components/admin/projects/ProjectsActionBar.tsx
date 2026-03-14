
import { Button } from '@/components/ui/button';
import { Plus, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ProjectsActionBarProps = {
  onAddProject: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  createButtonText?: string;
  cancelRoute?: string;
  showSaveButtons?: boolean;
};

export const ProjectsActionBar = ({ 
  onAddProject, 
  onSave, 
  isSaving = false,
  createButtonText = 'Add New Project',
  cancelRoute = '/admin',
  showSaveButtons = true
}: ProjectsActionBarProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onAddProject}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        {createButtonText}
      </Button>

      {showSaveButtons && (
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(cancelRoute)}
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
      )}
    </div>
  );
};
