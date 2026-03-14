import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useExperienceData } from '@/hooks/useExperienceData';
import ExperienceForm from '@/components/admin/experience/ExperienceForm';
import ExperienceActionBar from '@/components/admin/experience/ExperienceActionBar';
import ExperienceLoadingState from '@/components/admin/experience/ExperienceLoadingState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CollapsibleAdminItem from '@/components/admin/CollapsibleAdminItem';
import { Experience } from '@/types';

const EditExperience: React.FC = () => {
  const {
    experienceItems,
    isLoading,
    isSaving,
    handleSave,
    handleAddExperience,
    handleRemoveExperience,
    updateExperienceField,
    updateHighlights,
    updateTechnologies,
    addHighlight,
    removeHighlight,
    addTechnology,
    removeTechnology
  } = useExperienceData();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleEditToggle = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };
  
  const handleSelectItem = (id: string) => {
    setSelectedId(id);
  };

  const handleTabChange = (value: string) => {
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout title="Edit Experience Page">
      <Tabs defaultValue="allExperience" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="allExperience">All Experience</TabsTrigger>
          <TabsTrigger value="createExperience">Create New Experience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allExperience" className="space-y-4">
          {isLoading ? (
            <ExperienceLoadingState />
          ) : (
            <div className="space-y-4">
              {experienceItems.length === 0 ? (
                <div className="text-center p-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-4">No experience items found. Add your first one!</p>
                  <Button onClick={handleAddExperience}>
                    <Plus size={16} className="mr-2" />
                    Add Experience
                  </Button>
                </div>
              ) : (
                <>
                  {experienceItems.map((experience) => (
                    <CollapsibleAdminItem
                      key={experience.id}
                      title={experience.title}
                      subtitle={`${experience.company} • ${experience.start_date} - ${experience.end_date || 'Present'}`}
                      badges={experience.technologies.map((tech, i) => (
                        <span key={i} className="bg-muted px-2 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                      isSelected={selectedId === experience.id}
                      onSelect={() => handleSelectItem(experience.id)}
                      onEdit={() => handleEditToggle(experience.id)}
                      onDelete={() => handleRemoveExperience(experience.id)}
                    >
                      {editingId === experience.id ? (
                        <ExperienceForm
                          key={experience.id}
                          experience={experience}
                          index={experienceItems.findIndex(exp => exp.id === experience.id)}
                          onRemove={handleRemoveExperience}
                          onUpdateField={updateExperienceField}
                          onUpdateHighlights={updateHighlights}
                          onAddHighlight={addHighlight}
                          onRemoveHighlight={removeHighlight}
                          onUpdateTechnologies={updateTechnologies}
                          onAddTechnology={addTechnology}
                          onRemoveTechnology={removeTechnology}
                          onSave={handleSave}
                          isSaving={isSaving}
                        />
                      ) : (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">{experience.description}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Highlights</h4>
                              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                {experience.highlights.map((highlight, index) => (
                                  <li key={index}>{highlight}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </CollapsibleAdminItem>
                  ))}
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save All Changes'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="createExperience" className="space-y-6">
          {experienceItems.length > 0 && experienceItems[experienceItems.length - 1].id.startsWith('exp-') ? (
            <ExperienceForm
              key={experienceItems[experienceItems.length - 1].id}
              experience={experienceItems[experienceItems.length - 1]}
              index={experienceItems.length - 1}
              onRemove={handleRemoveExperience}
              onUpdateField={updateExperienceField}
              onUpdateHighlights={updateHighlights}
              onAddHighlight={addHighlight}
              onRemoveHighlight={removeHighlight}
              onUpdateTechnologies={updateTechnologies}
              onAddTechnology={addTechnology}
              onRemoveTechnology={removeTechnology}
            />
          ) : (
            <div className="text-center p-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">Create a new experience entry</p>
              <Button onClick={handleAddExperience}>
                <Plus size={16} className="mr-2" />
                Add New Experience
              </Button>
            </div>
          )}

          <ExperienceActionBar 
            onAddExperience={handleAddExperience}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default EditExperience;
