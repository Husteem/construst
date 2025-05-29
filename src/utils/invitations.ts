
import { UserRole } from '@/types';

export interface InvitationData {
  id: string;
  invitation_code: string;
  role: UserRole;
  email?: string;
  project_name?: string;
  admin_id: string;
  expires_at: string;
  status: string;
}

export const validateInvitationCode = async (code: string): Promise<InvitationData | null> => {
  try {
    // Mock validation for now since database schema is not updated
    const mockInvitations: InvitationData[] = [
      {
        id: '1',
        invitation_code: 'INV-ABC123',
        role: 'worker',
        email: 'worker@example.com',
        project_name: 'Building Construction Phase 1',
        admin_id: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: '2',
        invitation_code: 'INV-DEF456',
        role: 'supplier',
        email: 'supplier@example.com',
        project_name: 'Road Infrastructure',
        admin_id: 'admin1',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      }
    ];

    const invitation = mockInvitations.find(inv => 
      inv.invitation_code === code && 
      inv.status === 'pending' && 
      new Date(inv.expires_at) > new Date()
    );

    return invitation || null;
  } catch (error) {
    console.error('Error validating invitation:', error);
    return null;
  }
};

export const markInvitationAsUsed = async (invitationId: string, userId: string): Promise<boolean> => {
  try {
    // Mock implementation for now
    console.log(`Mock: Marking invitation ${invitationId} as used by user ${userId}`);
    return true;
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
    // Mock implementation for now
    console.log(`Mock: Creating user assignment - Admin: ${adminId}, User: ${userId}, Project: ${projectName}`);
    return true;
  } catch (error) {
    console.error('Error creating user assignment:', error);
    return false;
  }
};

export const generateInvitationUrl = (code: string): string => {
  return `${window.location.origin}/signup?invitation=${code}`;
};
