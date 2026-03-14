import { AboutData } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PersonalDetailsFormProps {
  aboutData: AboutData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutData>>;
}

const PersonalDetailsForm = ({ aboutData, setAboutData }: PersonalDetailsFormProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                value={aboutData.name}
                onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Professional Title
              </label>
              <Input
                id="title"
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="bio">
              Bio
            </label>
            <Textarea
              id="bio"
              value={aboutData.bio}
              onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Write a compelling bio. Use paragraphs separated by blank lines.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Contact & Links (editable without re-deploy)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={aboutData.email ?? ''}
                  onChange={(e) => setAboutData({ ...aboutData, email: e.target.value || undefined })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="linkedin">
                  LinkedIn URL
                </label>
                <Input
                  id="linkedin"
                  value={aboutData.linkedin_url ?? ''}
                  onChange={(e) => setAboutData({ ...aboutData, linkedin_url: e.target.value || undefined })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="github">
                  GitHub URL
                </label>
                <Input
                  id="github"
                  value={aboutData.github_url ?? ''}
                  onChange={(e) => setAboutData({ ...aboutData, github_url: e.target.value || undefined })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="resume">
                  Resume / CV URL
                </label>
                <Input
                  id="resume"
                  value={aboutData.resume_url ?? ''}
                  onChange={(e) => setAboutData({ ...aboutData, resume_url: e.target.value || undefined })}
                  placeholder="https://... or leave blank"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your PDF to Storage in Admin and paste the public URL here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDetailsForm;
