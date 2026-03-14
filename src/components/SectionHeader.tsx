
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string | ReactNode;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="mb-12 text-center">
      <h2 className="section-title animate-fade-in">{title}</h2>
      {subtitle && (
        typeof subtitle === 'string' 
          ? <p className="section-subtitle animate-fade-in animate-delay-100">{subtitle}</p>
          : subtitle
      )}
    </div>
  );
};

export default SectionHeader;
