
import { Label } from '@/components/ui/label';
import MediaUpload from '../../MediaUpload';
import { Project } from '@/types';
import { Image } from 'lucide-react';

type ProjectImageProps = {
  project: Project;
  onUploadComplete: (id: string, urls: string[]) => void;
};

export const ProjectImage = ({ project, onUploadComplete }: ProjectImageProps) => {
  return (
    <div>
      <Label className="flex items-center gap-2 mb-2">
        <Image className="h-4 w-4" /> Project Image
      </Label>
      
      {project.image && project.image !== '/placeholder.svg' && (
        <div className="mb-4">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-40 h-40 object-cover rounded-md border" 
            onError={(e) => {
              console.error("Image failed to load:", project.image);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      )}
      
      <MediaUpload 
        bucketName="project-images" 
        folder="projects"
        onUploadComplete={(urls) => {
          if (urls && urls.length > 0) {
            console.log(`Upload complete for project ${project.id}:`, urls);
            onUploadComplete(project.id, urls);
          }
        }}
        maxFiles={1}
      />
    </div>
  );
};
