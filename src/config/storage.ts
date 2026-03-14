
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { appConfig } from './appConfig';

// List of storage buckets required by the application
const requiredBuckets = [
  { id: 'profile-images', isPublic: true },
  { id: 'project-images', isPublic: true },
  { id: 'blog-images', isPublic: true },
  { id: 'personal-images', isPublic: true },
  { id: 'research-papers', isPublic: true }
];

/**
 * Checks if a bucket exists but doesn't attempt to create it
 * if it doesn't exist (since this requires admin privileges)
 */
export async function ensureBucketExists(bucketName: string) {
  try {
    console.log(`Checking if bucket exists: ${bucketName}`);
    
    // First try to list objects in the bucket as a direct test
    const { data: objects, error: objectsError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });
      
    if (!objectsError) {
      console.log(`Successfully listed objects in bucket ${bucketName}`);
      return true;
    }
    
    // If there's an error, check if it's a permission error vs. bucket not existing
    console.error(`Error listing objects in bucket ${bucketName}:`, objectsError);
    
    if (objectsError.message.includes("The resource was not found") || 
        objectsError.message.includes("bucket not found")) {
      console.warn(`Storage bucket '${bucketName}' doesn't exist.`);
      
      if (appConfig.storage.showFriendlyBucketErrors) {
        toast.error(`Storage bucket "${bucketName}" not found. Please contact administrator.`);
      }
      
      return false;
    }
    
    if (objectsError.message.includes("not enough permissions")) {
      // We hit a permission error, which likely means the bucket exists
      // but the current user doesn't have access
      console.warn(`Permission error for bucket ${bucketName}, but it likely exists`);
      
      // Check auth status to give better error message
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.warning("You need to be logged in to access storage features");
        return false;
      }
      
      toast.warning("You don't have permission to access this storage bucket");
      return false;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking bucket existence:", error);
    return false;
  }
}

/**
 * Checks storage buckets existence but doesn't try to create them
 */
export async function ensureStorageBucketsExist() {
  try {
    console.log("Checking storage buckets...");
    
    // Get the user's session to check if they're authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    const isAuthenticated = !!sessionData.session;
    
    if (!isAuthenticated) {
      console.warn("User is not authenticated. This may limit storage functionality.");
    }
    
    let allBucketsExist = true;
    let bucketsChecked = 0;
    
    for (const bucket of requiredBuckets) {
      try {
        const exists = await ensureBucketExists(bucket.id);
        bucketsChecked++;
        
        if (exists) {
          console.log(`✓ Bucket ${bucket.id} is ready`);
        } else {
          console.warn(`✗ Bucket ${bucket.id} could not be accessed`);
          allBucketsExist = false;
        }
      } catch (bucketError) {
        console.error(`Error with bucket ${bucket.id}:`, bucketError);
        allBucketsExist = false;
      }
    }

    console.log(`Bucket check complete: ${bucketsChecked}/${requiredBuckets.length} buckets checked`);

    if (!allBucketsExist) {
      if (isAuthenticated) {
        toast.error("Some storage features may be limited. Please contact an administrator.");
      } else {
        toast.warning("Sign in to enable media uploads and storage features");
      }
    }
  } catch (error) {
    console.error("Error checking storage buckets:", error);
    toast.error("Some media features may be limited. Please contact an administrator.");
  }
}
