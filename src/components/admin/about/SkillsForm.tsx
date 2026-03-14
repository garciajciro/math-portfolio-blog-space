
import { useState } from 'react';
import { AboutData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SkillsFormProps {
  aboutData: AboutData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutData>>;
}

const SkillsForm = ({ aboutData, setAboutData }: SkillsFormProps) => {
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() !== '' && !aboutData.skills.includes(skillInput.trim())) {
      setAboutData({
        ...aboutData,
        skills: [...aboutData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setAboutData({
      ...aboutData,
      skills: aboutData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Skills</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {aboutData.skills.map((skill, index) => (
          <div
            key={index}
            className="bg-muted px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="text-muted-foreground hover:text-destructive"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add a skill..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />
        <Button type="button" onClick={handleAddSkill}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default SkillsForm;
