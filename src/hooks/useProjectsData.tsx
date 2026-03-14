import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProjectsData = () => {
  const [projectItems, setProjectItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform to match our Project type
          const transformedData: Project[] = data.map(item => ({
            id: item.id,
            title: item.title || 'Untitled Project',
            description: item.description || '',
            technologies: item.technologies || [],
            image: item.image || '/placeholder.svg',
            link: item.link || '',
            github: item.github || '',
            featured: item.featured || false,
            category: item.category as 'web' | 'mobile' | 'academic' | 'other'
          }));
          
          setProjectItems(transformedData);
        } else {
          // Use empty array if no data exists
          setProjectItems([]);
        }
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        toast.error("Error fetching projects: " + (err.message || "Unable to load project data"));
        setProjectItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // First delete all projects that have been removed locally
      const currentIds = projectItems
        .map(item => item.id)
        .filter(id => !id.startsWith('proj-')); // Only include real DB IDs, not temp ones
      
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('id');
      
      if (existingProjects) {
        const projectsToDelete = existingProjects
          .filter(p => !currentIds.includes(p.id))
          .map(p => p.id);
        
        if (projectsToDelete.length > 0) {
          await supabase
            .from('projects')
            .delete()
            .in('id', projectsToDelete);
        }
      }
      
      // Now handle projects one by one
      for (const project of projectItems) {
        // Check if this is a new project (with temp ID)
        const isNew = project.id.startsWith('proj-');
        
        if (isNew) {
          // For new projects, remove the 'id' field entirely to let Supabase generate a UUID
          const { id, ...projectDataWithoutId } = project;
          console.log("Creating new project without ID:", projectDataWithoutId);
          
          const { data, error } = await supabase
            .from('projects')
            .insert([projectDataWithoutId])
            .select();
          
          if (error) {
            console.error("Error creating project:", error);
            throw error;
          }
          
          // Update the local state with the new ID
          if (data && data[0]) {
            setProjectItems(prev => 
              prev.map(p => p.id === project.id ? { ...p, id: data[0].id } : p)
            );
          }
        } else {
          // For existing projects, keep the ID
          console.log("Updating project:", project);
          const { error } = await supabase
            .from('projects')
            .update(project)
            .eq('id', project.id);
          
          if (error) {
            console.error("Error updating project:", error);
            throw error;
          }
        }
      }
      
      toast.success("Your projects have been saved successfully");
    } catch (error: any) {
      console.error("Error saving projects:", error);
      toast.error("Save failed: " + (error.message || "There was an error saving your changes"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`, // Temporary ID, will be replaced with UUID on save
      title: "New Project",
      description: "Project description goes here",
      category: "web",
      image: "/placeholder.svg",
      technologies: ["Technology 1"],
      github: "",
      link: "",
      featured: false
    };
    
    setProjectItems([...projectItems, newProject]);
  };

  const handleRemoveProject = async (id: string) => {
    // If it's a real project (not a new one), delete it from the database
    if (!id.startsWith('proj-')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Project deleted successfully");
      } catch (error: any) {
        console.error("Error deleting project:", error);
        toast.error("Delete failed: " + (error.message || "Failed to remove project"));
        return; // Don't remove from state if the DB delete failed
      }
    }
    
    // Remove from local state
    setProjectItems(projectItems.filter(proj => proj.id !== id));
  };

  const updateProjectField = (id: string, field: string, value: any) => {
    setProjectItems(projectItems.map(proj => {
      if (proj.id === id) {
        return { ...proj, [field]: value };
      }
      return proj;
    }));
  };

  const updateTechnologies = (id: string, technologies: string[]) => {
    setProjectItems(projectItems.map(proj => {
      if (proj.id === id) {
        return { ...proj, technologies };
      }
      return proj;
    }));
  };

  const addTechnology = (id: string) => {
    setProjectItems(projectItems.map(proj => {
      if (proj.id === id) {
        return { ...proj, technologies: [...proj.technologies, "New technology"] };
      }
      return proj;
    }));
  };

  const removeTechnology = (id: string, index: number) => {
    setProjectItems(projectItems.map(proj => {
      if (proj.id === id) {
        const newTechnologies = [...proj.technologies];
        newTechnologies.splice(index, 1);
        return { ...proj, technologies: newTechnologies };
      }
      return proj;
    }));
  };

  const handleUploadComplete = (id: string, urls: string[]) => {
    console.log(`Upload complete for project ${id}:`, urls);
    if (urls.length > 0) {
      updateProjectField(id, "image", urls[0]);
    }
  };

  return {
    projectItems,
    isLoading,
    isSaving,
    handleSave,
    handleAddProject,
    handleRemoveProject,
    updateProjectField,
    updateTechnologies,
    addTechnology,
    removeTechnology,
    handleUploadComplete
  };
};
