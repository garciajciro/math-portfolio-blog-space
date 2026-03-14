import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { AboutData } from '../../types';
import PersonalDetailsForm from '@/components/admin/about/PersonalDetailsForm';
import SkillsForm from '@/components/admin/about/SkillsForm';
import EducationForm from '@/components/admin/about/EducationForm';
import ResearchInterestsForm from '@/components/admin/about/ResearchInterestsForm';
import ProfileImageForm from '@/components/admin/about/ProfileImageForm';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const EditAbout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const defaultVisibility = {
    about: true,
    experience: true,
    projects: true,
    blog: true,
    personal: true,
    research: true,
  };
  const [aboutData, setAboutData] = useState<AboutData>({
    name: '',
    title: '',
    bio: '',
    image_url: '',
    skills: [],
    education: [],
    researchInterests: [],
    section_visibility: defaultVisibility,
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('about_data').select('*').limit(1).single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          // Convert education from JSON to our expected format
          const educationData = data.education ? data.education.map((edu: any) => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startYear: edu.startYear || 0,
            endYear: edu.endYear
          })) : [];
          
          // Convert research interests from JSON to our expected format
          const researchInterestsData = data.research_interests ? data.research_interests.map((interest: any) => ({
            title: interest.title || '',
            description: interest.description || ''
          })) : [];
          
          setAboutData({
            id: data.id,
            name: data.name || '',
            title: data.title || '',
            bio: data.bio || '',
            image_url: data.image_url || '',
            skills: data.skills || [],
            education: educationData,
            researchInterests: researchInterestsData,
            email: data.email ?? undefined,
            linkedin_url: data.linkedin_url ?? undefined,
            github_url: data.github_url ?? undefined,
            resume_url: data.resume_url ?? undefined,
            section_visibility: (data.section_visibility as AboutData['section_visibility']) ?? defaultVisibility,
          });
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load about data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, [toast]);

  const handleSave = async () => {
    try {
      // Sort education before saving to ensure consistent order
      const sortedEducation = [...aboutData.education].sort((a, b) => {
        // If endYear is null, it means it's current, so it should come first
        if (a.endYear === null && b.endYear === null) return 0;
        if (a.endYear === null) return -1;
        if (b.endYear === null) return 1;
        
        // Otherwise, sort by endYear in descending order
        return b.endYear - a.endYear;
      });
      
      // Convert sorted education array to a format suitable for Supabase JSON storage
      const formattedEducation = sortedEducation.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startYear: edu.startYear,
        endYear: edu.endYear
      }));

      // Convert research interests array to a format suitable for Supabase JSON storage
      const formattedResearchInterests = (aboutData.researchInterests || []).map(interest => ({
        title: String(interest.title ?? ''),
        description: String(interest.description ?? '')
      }));

      const payload = {
        name: aboutData.name?.trim() ?? null,
        title: aboutData.title?.trim() ?? null,
        bio: aboutData.bio?.trim() ?? null,
        image_url: aboutData.image_url?.trim() || null,
        skills: Array.isArray(aboutData.skills) ? aboutData.skills : [],
        education: formattedEducation,
        research_interests: formattedResearchInterests,
        email: aboutData.email?.trim() || null,
        linkedin_url: aboutData.linkedin_url?.trim() || null,
        github_url: aboutData.github_url?.trim() || null,
        resume_url: aboutData.resume_url?.trim() || null,
        section_visibility: aboutData.section_visibility ?? defaultVisibility,
        updated_at: new Date().toISOString()
      };

      if (aboutData.id) {
        const { data: updated, error } = await supabase
          .from('about_data')
          .update(payload)
          .eq('id', aboutData.id)
          .select('id')
          .single();
        if (error) throw error;
        if (!updated) throw new Error('Update did not return a row. You may not have permission.');
      } else {
        const { data: inserted, error } = await supabase
          .from('about_data')
          .insert([payload])
          .select('id')
          .single();
        if (error) throw error;
        if (!inserted) throw new Error('Insert did not return a row.');
        setAboutData(prev => ({ ...prev, id: inserted.id }));
      }

      toast({
        title: 'Success',
        description: 'About information saved successfully',
      });
    } catch (error: any) {
      console.error('Error saving about data:', error);
      const message = error?.message || error?.error_description || 'Failed to save about data';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleImageUploaded = async (urls: string[]) => {
    const newUrl = urls.length > 0 ? urls[0] : '';
    const currentId = aboutData.id;
    setAboutData((prev) => ({ ...prev, image_url: newUrl }));

    // Persist profile image (or clear) to DB immediately
    if (currentId) {
      try {
        const { error } = await supabase
          .from('about_data')
          .update({
            image_url: newUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentId);
        if (error) throw error;
        toast({
          title: newUrl ? 'Profile image saved' : 'Profile image removed',
          description: newUrl ? 'Your profile photo is now live on the About page.' : 'The profile photo has been removed.',
        });
      } catch (err: any) {
        console.error('Error saving profile image:', err);
        toast({
          title: 'Could not update image',
          description: err?.message || 'Click "Save Changes" below to try again.',
          variant: 'destructive',
        });
      }
    } else if (newUrl) {
      toast({
        title: 'Image ready',
        description: 'Click "Save Changes" below to save your profile and image.',
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="About">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">Loading about data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit About Information">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold mb-8">Edit About Information</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <PersonalDetailsForm aboutData={aboutData} setAboutData={setAboutData} />
                  <SkillsForm aboutData={aboutData} setAboutData={setAboutData} />
                  <EducationForm aboutData={aboutData} setAboutData={setAboutData} />
                  <ResearchInterestsForm aboutData={aboutData} setAboutData={setAboutData} />
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-3">Section visibility</h3>
                      <p className="text-sm text-muted-foreground mb-4">Hide sections from the public site. Links and pages will be hidden.</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(['about', 'experience', 'projects', 'blog', 'personal', 'research'] as const).map((key) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`vis-${key}`}
                              checked={aboutData.section_visibility?.[key] !== false}
                              onCheckedChange={(checked) =>
                                setAboutData((prev) => ({
                                  ...prev,
                                  section_visibility: {
                                    ...prev.section_visibility,
                                    [key]: checked !== false,
                                  },
                                }))
                              }
                            />
                            <Label htmlFor={`vis-${key}`} className="capitalize">{key}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <ProfileImageForm imageUrl={aboutData.image_url} onImageUploaded={handleImageUploaded} />

            <div className="mt-8 flex flex-col gap-4">
              <Button onClick={handleSave} size="lg" className="w-full">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/admin')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditAbout;
