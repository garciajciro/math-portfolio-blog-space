
import React from 'react';
import { Loader2 } from 'lucide-react';

const ExperienceLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-12 w-12 animate-spin text-portfolio-primary" />
    </div>
  );
};

export default ExperienceLoadingState;
