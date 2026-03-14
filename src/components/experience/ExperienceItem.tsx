
import React from 'react';
import { Experience } from '@/types';

type ExperienceItemProps = {
  experience: Experience;
};

const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 relative mb-6 transition-shadow hover:shadow-card-hover">
      <h3 className="text-xl font-serif font-normal text-foreground mb-1">{experience.title}</h3>
      <h4 className="text-lg font-medium text-portfolio-teal mb-2">{experience.company}</h4>
      <p className="text-muted-foreground text-sm mb-2">{experience.location}</p>
      <p className="text-muted-foreground text-sm mb-4">
        {experience.start_date} – {experience.end_date || 'Present'}
      </p>
      <p className="text-foreground mb-4">{experience.description}</p>
      
      {experience.highlights && experience.highlights.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-foreground mb-2">Highlights</h5>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            {experience.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
      
      {experience.technologies && experience.technologies.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-foreground mb-2">Technologies</h5>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech, index) => (
              <span key={index} className="tag">{tech}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceItem;
