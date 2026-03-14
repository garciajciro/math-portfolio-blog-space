
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Grants admin role to a user by their email
 * @param email The email of the user to grant admin role to
 * @returns Promise with the result of the operation
 */
export const grantAdminAccess = async (email: string): Promise<{success: boolean; message: string; userId?: string}> => {
  try {
    // First, find the user by email using custom RPC function
    const { data: userData, error: userError } = await supabase.rpc('get_user_by_email', { 
      email_address: email 
    });
    
    if (userError || !userData || userData.length === 0) {
      console.error('Error finding user:', userError);
      return { 
        success: false, 
        message: `User with email ${email} not found. Make sure they have registered first.` 
      };
    }
    
    const userId = userData[0].id;

    // Get the admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .maybeSingle();
    
    if (roleError) {
      console.error('Error finding admin role:', roleError);
      return { success: false, message: 'Error finding admin role: ' + roleError.message };
    }
    
    if (!adminRole) {
      console.error('Admin role not found');
      return { success: false, message: 'Admin role not found in the database. Please check your database setup.' };
    }

    // Check if user already has admin role
    const { data: existingRole, error: existingRoleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', adminRole.id)
      .maybeSingle();
    
    if (existingRoleError) {
      console.error('Error checking existing role:', existingRoleError);
    }
    
    if (existingRole) {
      return { 
        success: false, 
        message: `User ${email} already has admin access.`,
        userId: userId
      };
    }

    // Add user to admin role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role_id: adminRole.id }]);
      
    if (insertError) {
      console.error('Error granting admin role:', insertError);
      return { success: false, message: `Failed to grant admin access: ${insertError.message}` };
    }

    return { 
      success: true, 
      message: `Admin access granted to ${email} successfully.`,
      userId: userId
    };
  } catch (error) {
    console.error('Unexpected error in grantAdminAccess:', error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

/**
 * Removes admin role from a user by their email
 * @param email The email of the user to remove admin role from
 * @returns Promise with the result of the operation
 */
export const revokeAdminAccess = async (email: string): Promise<{success: boolean; message: string}> => {
  try {
    // First, find the user by email using custom RPC function
    const { data: userData, error: userError } = await supabase.rpc('get_user_by_email', { 
      email_address: email 
    });
    
    if (userError || !userData || userData.length === 0) {
      console.error('Error finding user:', userError);
      return { success: false, message: `User with email ${email} not found.` };
    }
    
    const userId = userData[0].id;

    // Get the admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .maybeSingle();
    
    if (roleError) {
      console.error('Error finding admin role:', roleError);
      return { success: false, message: 'Error finding admin role: ' + roleError.message };
    }
    
    if (!adminRole) {
      console.error('Admin role not found');
      return { success: false, message: 'Admin role not found in the database. Please check your database setup.' };
    }

    // Remove user from admin role
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', adminRole.id);
      
    if (deleteError) {
      console.error('Error revoking admin role:', deleteError);
      return { success: false, message: `Failed to revoke admin access: ${deleteError.message}` };
    }

    return { success: true, message: `Admin access revoked from ${email} successfully.` };
  } catch (error) {
    console.error('Unexpected error in revokeAdminAccess:', error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

/**
 * Gets a list of users with admin role
 * @returns Promise with the list of admin users
 */
export const getAdminUsers = async () => {
  try {
    // First, get the admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .maybeSingle();

    if (roleError) {
      console.error('Error finding admin role:', roleError);
      return { success: false, admins: [], message: 'Error finding admin role: ' + roleError.message };
    }
    
    if (!adminRole) {
      console.error('Admin role not found');
      return { success: false, admins: [], message: 'Admin role not found in the database. Please check your database setup.' };
    }

    // Get all users with the admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role_id', adminRole.id);
      
    if (error) {
      console.error('Error getting admin users:', error);
      return { success: false, admins: [], message: `Failed to get admin users: ${error.message}` };
    }

    // Fetch profiles separately for each admin user
    const adminsWithProfiles = [];
    for (const admin of data) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', admin.user_id)
        .maybeSingle();
      
      adminsWithProfiles.push({
        user_id: admin.user_id,
        profiles: profileData || null
      });
    }

    return { 
      success: true, 
      admins: adminsWithProfiles, 
      message: 'Admin users retrieved successfully.' 
    };
  } catch (error) {
    console.error('Unexpected error in getAdminUsers:', error);
    return { 
      success: false, 
      admins: [], 
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

/**
 * Checks if a user is an admin
 * @param userId The user ID to check
 * @returns Promise resolving to boolean indicating if user is admin
 */
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Unexpected error in checkAdminStatus:', error);
    return false;
  }
};
