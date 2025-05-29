
import { supabase } from '@/integrations/supabase/client';

export interface InvitationData {
  id: string;
  invitation_code: string;
  role: string;
  email?: string;
  project_name?: string;
  admin_id: string;
  expires_at: string;
  status: string;
}

export const validateInvitationCode = async (code: string): Promise<InvitationData | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('invitation_code', code)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      console.error('Invitation validation error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error validating invitation:', error);
    return null;
  }
};

export const markInvitationAsUsed = async (invitationId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('invitations')
      .update({ 
        status: 'used', 
        used_at: new Date().toISOString(),
        used_by: userId 
      })
      .eq('id', invitationId);

    return !error;
  } catch (error) {
    console.error('Error marking invitation as used:', error);
    return false;
  }
};

export const createUserAssignment = async (
  adminId: string, 
  userId: string, 
  projectName?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_assignments')
      .insert({
        admin_id: adminId,
        user_id: userId,
        project_name: projectName,
      });

    return !error;
  } catch (error) {
    console.error('Error creating user assignment:', error);
    return false;
  }
};

export const generateInvitationUrl = (code: string): string => {
  return `${window.location.origin}/signup?invitation=${code}`;
};
