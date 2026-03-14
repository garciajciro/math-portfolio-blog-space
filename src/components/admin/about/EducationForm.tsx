
import { AboutData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EducationFormProps {
  aboutData: AboutData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutData>>;
}

const EducationForm = ({ aboutData, setAboutData }: EducationFormProps) => {
  const handleAddEducation = () => {
    setAboutData({
      ...aboutData,
      education: [
        ...aboutData.education,
        {
          institution: '',
          degree: '',
          field: '',
          startYear: new Date().getFullYear(),
          endYear: null,
        },
      ],
    });
  };

  const handleUpdateEducation = (index: number, field: string, value: string | number | null) => {
    const updatedEducation = [...aboutData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setAboutData({
      ...aboutData,
      education: updatedEducation,
    });
  };

  const handleRemoveEducation = (index: number) => {
    setAboutData({
      ...aboutData,
      education: aboutData.education.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Education</h3>
      {aboutData.education.map((edu, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <Input
                value={edu.institution}
                onChange={(e) =>
                  handleUpdateEducation(index, 'institution', e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <Input
                value={edu.degree}
                onChange={(e) =>
                  handleUpdateEducation(index, 'degree', e.target.value)
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Field of Study</label>
            <Input
              value={edu.field}
              onChange={(e) =>
                handleUpdateEducation(index, 'field', e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Year</label>
              <Input
                type="number"
                value={edu.startYear}
                onChange={(e) =>
                  handleUpdateEducation(
                    index,
                    'startYear',
                    parseInt(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Year</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={edu.endYear || ''}
                  onChange={(e) =>
                    handleUpdateEducation(
                      index,
                      'endYear',
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  disabled={edu.endYear === null}
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={edu.endYear === null}
                  onChange={(e) =>
                    handleUpdateEducation(
                      index,
                      'endYear',
                      e.target.checked ? null : new Date().getFullYear()
                    )
                  }
                />
                <label htmlFor={`current-${index}`} className="ml-2 text-sm">
                  Current / In Progress
                </label>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveEducation(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddEducation}>
        Add Education
      </Button>
    </div>
  );
};

export default EducationForm;
