
import { AboutData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ResearchInterestsFormProps {
  aboutData: AboutData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutData>>;
}

const ResearchInterestsForm = ({ aboutData, setAboutData }: ResearchInterestsFormProps) => {
  const handleAddResearchInterest = () => {
    const interests = aboutData.researchInterests || [];
    setAboutData({
      ...aboutData,
      researchInterests: [
        ...interests,
        {
          title: '',
          description: ''
        },
      ],
    });
  };

  const handleUpdateResearchInterest = (index: number, field: string, value: string) => {
    const updatedInterests = [...(aboutData.researchInterests || [])];
    updatedInterests[index] = {
      ...updatedInterests[index],
      [field]: value,
    };
    setAboutData({
      ...aboutData,
      researchInterests: updatedInterests,
    });
  };

  const handleRemoveResearchInterest = (index: number) => {
    setAboutData({
      ...aboutData,
      researchInterests: (aboutData.researchInterests || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Research Interests</h3>
      {(aboutData.researchInterests || []).map((interest, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={interest.title}
              onChange={(e) =>
                handleUpdateResearchInterest(index, 'title', e.target.value)
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={interest.description}
              onChange={(e) =>
                handleUpdateResearchInterest(index, 'description', e.target.value)
              }
              rows={3}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveResearchInterest(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddResearchInterest}>
        Add Research Interest
      </Button>
    </div>
  );
};

export default ResearchInterestsForm;
