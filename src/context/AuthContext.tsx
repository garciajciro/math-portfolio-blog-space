
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthResponse = {
  user: User | null;
  session: Session | null;
  weakPassword?: unknown | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ user: null, session: null }),
  signUp: async () => ({ user: null, session: null }),
  signOut: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message || "Invalid email or password");
        throw error;
      }

      // Set a fresh access timestamp
      localStorage.setItem('lastAuthAccess', Date.now().toString());
      
      toast.success("Login successful", {
        description: "You have successfully logged in."
      });

      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message || "Failed to sign up");
        throw error;
      }
      
      toast.success("Registration successful", {
        description: "Your account has been created. Please verify your email before signing in."
      });

      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message || "Failed to sign out");
        throw error;
      }
      
      // Clear session
      localStorage.removeItem('lastAuthAccess');
      
      toast.success("Signed out successfully");
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // First set up listener for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state changed:", event);
            // Only update state with synchronous operations here
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setIsLoading(false);
          }
        );

        // Check initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
