
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Plus, Eye, Ban, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

interface Invitation {
  id: string;
  invitation_code: string;
  role: UserRole;
  email?: string;
  project_name?: string;
  status: 'pending' | 'used' | 'expired' | 'revoked';
  expires_at: string;
  used_at?: string;
  created_at: string;
}

const InvitationManager = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    role: '' as UserRole,
    email: '',
    project_name: '',
    expires_in_days: '7'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      // Mock data for now since schema is not yet updated
      const mockInvitations: Invitation[] = [
        {
          id: '1',
          invitation_code: 'INV-ABC123',
          role: 'worker',
          email: 'worker@example.com',
          project_name: 'Building Construction Phase 1',
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          invitation_code: 'INV-DEF456',
          role: 'supplier',
          email: 'supplier@example.com',
          project_name: 'Road Infrastructure',
          status: 'used',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          used_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      ];
      
      setInvitations(mockInvitations);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error fetching invitations",
        description: "Using mock data for demonstration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createInvitation = async () => {
    if (!formData.role) {
      toast({
        title: "Validation Error",
        description: "Please select a role for the invitation",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Generate mock invitation code
      const invitationCode = `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expires_in_days));

      const newInvitation: Invitation = {
        id: Math.random().toString(36).substr(2, 9),
        invitation_code: invitationCode,
        role: formData.role,
        email: formData.email || undefined,
        project_name: formData.project_name || undefined,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      };

      setInvitations(prev => [newInvitation, ...prev]);

      toast({
        title: "Invitation Created",
        description: `Invitation code: ${invitationCode}`,
      });

      setFormData({
        role: '' as UserRole,
        email: '',
        project_name: '',
        expires_in_days: '7'
      });
      setShowCreateForm(false);
    } catch (error: any) {
      toast({
        title: "Error creating invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyInvitationCode = (code: string) => {
    const invitationUrl = `${window.location.origin}/signup?invitation=${code}`;
    navigator.clipboard.writeText(invitationUrl);
    toast({
      title: "Copied!",
      description: "Invitation link copied to clipboard",
    });
  };

  const revokeInvitation = async (id: string) => {
    try {
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === id ? { ...inv, status: 'revoked' as const } : inv
        )
      );

      toast({
        title: "Invitation Revoked",
        description: "The invitation has been revoked successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error revoking invitation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (isExpired && status === 'pending') {
      return <Badge variant="secondary"><Clock size={12} className="mr-1" />Expired</Badge>;
    }

    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock size={12} className="mr-1" />Pending</Badge>;
      case 'used':
        return <Badge variant="default" className="bg-green-500"><CheckCircle size={12} className="mr-1" />Used</Badge>;
      case 'revoked':
        return <Badge variant="destructive"><Ban size={12} className="mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-gray-900">
            Invitation Management
          </h2>
          <p className="text-gray-600">Create and manage invitations for workers and suppliers</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Create Invitation
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Invitation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worker">Construction Worker</SelectItem>
                    <SelectItem value="supplier">Material Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="worker@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="project_name">Project Name (Optional)</Label>
                <Input
                  id="project_name"
                  placeholder="Building Construction Phase 1"
                  value={formData.project_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="expires_in_days">Expires In (Days)</Label>
                <Select 
                  value={formData.expires_in_days}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, expires_in_days: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={createInvitation} 
                disabled={isCreating}
                className="bg-primary hover:bg-primary/90"
              >
                {isCreating ? 'Creating...' : 'Create Invitation'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No invitations created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-mono">{invitation.invitation_code}</TableCell>
                    <TableCell className="capitalize">{invitation.role}</TableCell>
                    <TableCell>{invitation.email || '-'}</TableCell>
                    <TableCell>{invitation.project_name || '-'}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status, invitation.expires_at)}</TableCell>
                    <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyInvitationCode(invitation.invitation_code)}
                        >
                          <Copy size={14} />
                        </Button>
                        {invitation.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeInvitation(invitation.id)}
                          >
                            <Ban size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationManager;
