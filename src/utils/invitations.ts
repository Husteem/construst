
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

export interface InvitationValidationResult {
  isValid: boolean;
  invitation?: {
    id: string;
    role: UserRole;
    email?: string;
    project_name?: string;
    admin_id: string;
  };
  error?: string;
}

export const validateInvitationCode = async (code: string): Promise<InvitationValidationResult> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('invitation_code', code)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return {
        isValid: false,
        error: 'Invalid or expired invitation code'
      };
    }

    return {
      isValid: true,
      invitation: {
        id: data.id,
        role: data.role as UserRole,
        email: data.email || undefined,
        project_name: data.project_name || undefined,
        admin_id: data.admin_id,
      }
    };
  } catch (error) {
    console.error('Error validating invitation:', error);
    return {
      isValid: false,
      error: 'Failed to validate invitation'
    };
  }
};

export const markInvitationAsUsed = async (invitationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('invitations')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        used_by: userId
      })
      .eq('id', invitationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking invitation as used:', error);
    return { success: false, error };
  }
};

export const createUserAssignment = async (adminId: string, userId: string, projectName?: string) => {
  try {
    const { error } = await supabase
      .from('user_assignments')
      .insert({
        admin_id: adminId,
        user_id: userId,
        project_name: projectName || null,
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error creating user assignment:', error);
    return { success: false, error };
  }
};
