
import AdminLayout from '../../components/AdminLayout';
import { Loader2 } from 'lucide-react';
import { ProjectForm } from '../../components/admin/projects/ProjectForm';
import { ProjectsActionBar } from '../../components/admin/projects/ProjectsActionBar';
import { useProjectsData } from '../../hooks/useProjectsData';
import { ProjectsList } from '../../components/admin/projects/ProjectsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EditProjects = () => {
  const { 
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
  } = useProjectsData();

  const handleTabChange = (value: string) => {
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit Projects">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-portfolio-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Projects">
      <Tabs defaultValue="allProjects" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="allProjects">All Projects</TabsTrigger>
          <TabsTrigger value="createProject">Create New Project</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allProjects" className="space-y-4">
          <ProjectsList 
            projects={projectItems}
            onRemove={handleRemoveProject}
            onFieldChange={updateProjectField}
            onTechnologiesChange={updateTechnologies}
            onAddTechnology={addTechnology}
            onRemoveTechnology={removeTechnology}
            onUploadComplete={handleUploadComplete}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="createProject" className="space-y-6">
          {projectItems.length > 0 && projectItems[projectItems.length - 1].id.startsWith('proj-') ? (
            <ProjectForm
              key={projectItems[projectItems.length - 1].id}
              project={projectItems[projectItems.length - 1]}
              index={projectItems.length - 1}
              onRemove={handleRemoveProject}
              onFieldChange={updateProjectField}
              onTechnologiesChange={updateTechnologies}
              onAddTechnology={addTechnology}
              onRemoveTechnology={removeTechnology}
              onUploadComplete={handleUploadComplete}
            />
          ) : null}
          
          <ProjectsActionBar 
            onAddProject={handleAddProject}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default EditProjects;
