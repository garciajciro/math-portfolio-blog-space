
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error(error.message || "Invalid email or password");
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isUserAdmin = async () => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    // Call is_admin RPC function
    const { data, error } = await supabase.rpc('is_admin', { 
      user_id: user.id
    });
    
    if (error) {
      console.error('Error checking if user is admin:', error);
      return false;
    }
    
    return !!data; // Convert to boolean
  } catch (error) {
    console.error('Error checking if user is admin:', error);
    return false;
  }
};
