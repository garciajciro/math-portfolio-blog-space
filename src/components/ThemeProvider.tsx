
import { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;
