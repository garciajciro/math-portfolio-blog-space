import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const defaultVisibility: Record<string, boolean> = {
  about: true,
  experience: true,
  projects: true,
  blog: true,
  personal: true,
  research: true,
};

export function useSectionVisibility() {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(defaultVisibility);

  useEffect(() => {
    const fetchVisibility = async () => {
      const { data } = await supabase
        .from('about_data')
        .select('section_visibility')
        .limit(1)
        .single();
      if (data?.section_visibility && typeof data.section_visibility === 'object') {
        setVisibility((prev) => ({ ...prev, ...(data.section_visibility as Record<string, boolean>) }));
      }
    };
    fetchVisibility();
  }, []);

  return visibility;
}

export function useIsSectionVisible(section: keyof typeof defaultVisibility) {
  const visibility = useSectionVisibility();
  return visibility[section] !== false;
}
