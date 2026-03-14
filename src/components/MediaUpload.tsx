
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ensureBucketExists } from "@/config/storage";

interface MediaUploadProps {
  bucketName: string;
  folder?: string;
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

const MediaUpload = ({ 
  bucketName, 
  folder = "", 
  onUploadComplete,
  maxFiles = 10 
}: MediaUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bucketReady, setBucketReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check bucket on component mount
  useEffect(() => {
    const checkBucket = async () => {
      setIsChecking(true);
      console.log(`Checking bucket ${bucketName}...`);
      try {
        const exists = await ensureBucketExists(bucketName);
        console.log(`Bucket ${bucketName} exists: ${exists}`);
        setBucketReady(exists);
        
        if (!exists) {
          setError(`Storage bucket "${bucketName}" cannot be accessed. File uploads are currently unavailable.`);
        } else {
          setError(null);
        }
      } catch (err: any) {
        console.error("Error checking bucket:", err);
        setError(`Storage system error: ${err.message}`);
        setBucketReady(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkBucket();
  }, [bucketName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    setError(null);
    
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files at once.`);
      return;
    }
    
    // Check file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.warning(`Some files were skipped: only images and PDFs are allowed`);
      const validFiles = selectedFiles.filter(file => validTypes.includes(file.type));
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!files.length) return;
    
    setUploading(true);
    setError(null);
    const uploadedUrls: string[] = [];
    
    try {
      console.log(`Uploading ${files.length} files to bucket: ${bucketName}`);
      
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.warn("User is not authenticated, upload may fail due to permissions");
      }
      
      for (const file of files) {
        // Create a unique filename with timestamp and random string
        const fileExt = file.name.split('.').pop();
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        const fileName = `${uniqueId}.${fileExt}`;
        const filePath = folder 
          ? `${folder}/${fileName}` 
          : fileName;
          
        console.log(`Uploading file: ${filePath} to ${bucketName}`);
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error("Upload error:", error);
          throw error;
        }
        
        console.log("Upload successful:", data);
        
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);
          
        console.log("Public URL:", urlData.publicUrl);
        uploadedUrls.push(urlData.publicUrl);
      }
      
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      
      onUploadComplete(uploadedUrls);
      setFiles([]);
    } catch (error: any) {
      console.error("Error uploading files:", error);
      
      // Provide more specific error messages
      if (error.statusCode === 403) {
        setError("Permission denied: You don't have access to upload files to this storage bucket. Please make sure you're logged in.");
        toast.error("Upload failed: Insufficient permissions");
      } else if (error.message && error.message.includes("not found")) {
        setError("Storage bucket is not available. Please contact your administrator to set up the required storage buckets.");
        toast.error("Upload failed: Storage bucket not available");
      } else if (error.message && error.message.includes("JWT")) {
        setError("Authentication error: You need to be logged in to upload files.");
        toast.error("Upload failed: Authentication required");
      } else {
        setError(error.message || "There was an error uploading your files. Please try again later.");
        toast.error("Upload failed: " + (error.message || "Please try again or contact the administrator"));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isChecking ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Checking storage access...</span>
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex items-center gap-2">
            <Input 
              type="file" 
              accept="image/*,application/pdf" 
              onChange={handleFileChange}
              multiple={maxFiles > 1}
              className="max-w-md"
              disabled={uploading || !bucketReady}
            />
            <Button 
              onClick={uploadFiles} 
              disabled={!files.length || uploading || !bucketReady}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-1" />
                  Upload
                </>
              )}
            </Button>
          </div>
          
          {files.length > 0 && (
            <div className="border rounded-md p-4 bg-muted/20 max-h-60 overflow-y-auto">
              <h4 className="text-sm font-medium mb-2">Selected Files ({files.length})</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between text-sm p-2 bg-background rounded">
                    <span className="truncate max-w-[300px]">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X size={14} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediaUpload;
