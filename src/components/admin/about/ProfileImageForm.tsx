
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileImageFormProps {
  imageUrl: string;
  onImageUploaded: (urls: string[]) => void;
}

const ProfileImageForm = ({ imageUrl, onImageUploaded }: ProfileImageFormProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteImage = async () => {
    try {
      setIsDeleting(true);
      
      if (!imageUrl) {
        toast.error("No image to delete");
        return;
      }
      
      // Extract filename from the URL
      const urlParts = imageUrl.split('/');
      const bucketName = 'profile-images';
      
      // The path should be everything after the bucket name in the URL
      const bucketIndex = urlParts.findIndex(part => part === bucketName);
      if (bucketIndex === -1) {
        console.error("Could not parse file path from URL:", imageUrl);
        toast.error("Failed to delete image: Could not determine file path");
        return;
      }
      
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      console.log(`Attempting to delete file: ${bucketName}/${filePath}`);
      
      // Delete the file from storage
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (deleteError) {
        console.error("Error deleting image from storage:", deleteError);
        toast.error(`Failed to delete image from storage: ${deleteError.message}`);
        return;
      }
      
      // Call the parent's callback with an empty array to clear the image
      // This will trigger the database update in the parent component
      onImageUploaded([]);
      toast.success("Profile image deleted successfully");
    } catch (error: any) {
      console.error("Error in delete handler:", error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Profile Image</h3>
        {imageUrl ? (
          <div className="mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={imageUrl} alt="Profile" />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteImage}
                disabled={isDeleting}
                className="mt-2"
              >
                <Trash2 size={16} className="mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete Image'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarFallback>No Image</AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <MediaUpload 
          bucketName="profile-images" 
          folder="about"
          onUploadComplete={onImageUploaded} 
          maxFiles={1}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileImageForm;
