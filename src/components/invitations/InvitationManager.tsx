import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Plus, Trash2, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
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
  created_at: string;
  used_at?: string;
  used_by?: string;
  admin_id: string;
  manager_name?: string;
}

// Store invitations in localStorage for development
const INVITATIONS_STORAGE_KEY = 'contrust_dev_invitations';

const InvitationManager = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: '' as UserRole,
    project_name: '',
    expires_in_days: '7',
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const getCurrentManager = () => {
    const storedRole = localStorage.getItem('dev_user_role') || 'manager';
    const managerId = `manager-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: managerId,
      name: `Development Manager`,
      role: storedRole as UserRole
    };
  };

  const fetchInvitations = () => {
    setIsLoading(true);
    try {
      const storedInvitations = localStorage.getItem(INVITATIONS_STORAGE_KEY);
      if (storedInvitations) {
        setInvitations(JSON.parse(storedInvitations));
      } else {
        const manager = getCurrentManager();
        const sampleInvitations: Invitation[] = [
          {
            id: '1',
            invitation_code: 'INV-ABC12345',
            role: 'worker',
            email: 'worker@example.com',
            project_name: 'Building Construction Phase 1',
            status: 'pending',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            admin_id: manager.id,
            manager_name: manager.name,
          },
          {
            id: '2',
            invitation_code: 'INV-DEF67890',
            role: 'supplier',
            email: 'supplier@example.com',
            project_name: 'Road Infrastructure',
            status: 'used',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            used_at: new Date().toISOString(),
            admin_id: manager.id,
            manager_name: manager.name,
          },
        ];
        setInvitations(sampleInvitations);
        localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(sampleInvitations));
      }
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const manager = getCurrentManager();
      const newInvitation: Invitation = {
        id: Math.random().toString(36).substr(2, 9),
        invitation_code: `INV-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        role: formData.role,
        email: formData.email || undefined,
        project_name: formData.project_name || undefined,
        status: 'pending',
        expires_at: new Date(Date.now() + parseInt(formData.expires_in_days) * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        admin_id: manager.id,
        manager_name: manager.name,
      };

      const updatedInvitations = [newInvitation, ...invitations];
      setInvitations(updatedInvitations);
      
      localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updatedInvitations));

      setFormData({
        email: '',
        role: '' as UserRole,
        project_name: '',
        expires_in_days: '7',
      });

      toast({
        title: "Invitation Created",
        description: "Invitation has been created successfully",
      });
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyInvitationLink = (code: string) => {
    const link = `${window.location.origin}/signup?invitation=${code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Invitation link has been copied to clipboard",
    });
  };

  const copyInvitationCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Invitation code has been copied to clipboard",
    });
  };

  const revokeInvitation = async (id: string) => {
    try {
      const updatedInvitations = invitations.map(inv => 
        inv.id === id ? { ...inv, status: 'revoked' as const } : inv
      );
      setInvitations(updatedInvitations);
      localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updatedInvitations));

      toast({
        title: "Invitation Revoked",
        description: "The invitation has been revoked successfully",
      });
    } catch (error: any) {
      console.error('Error revoking invitation:', error);
      toast({
        title: "Error",
        description: "Failed to revoke invitation",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-500"><Clock size={12} className="mr-1" />Pending</Badge>;
      case 'used':
        return <Badge variant="default" className="bg-green-500"><CheckCircle size={12} className="mr-1" />Used</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Expired</Badge>;
      case 'revoked':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'worker':
        return <Badge variant="default" className="bg-blue-500">Worker</Badge>;
      case 'supplier':
        return <Badge variant="default" className="bg-green-500">Supplier</Badge>;
      case 'manager':
        return <Badge variant="default" className="bg-purple-500">Manager</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
          Invitation Management
        </h2>
        <p className="text-gray-600">Create and manage invitations for workers and suppliers</p>
      </div>

      {/* Create Invitation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Create New Invitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worker">Construction Worker</SelectItem>
                    <SelectItem value="supplier">Material Supplier</SelectItem>
                    <SelectItem value="manager">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name (Optional)</Label>
                <Input
                  id="project_name"
                  placeholder="Building Construction Phase 1"
                  value={formData.project_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_in_days">Expires In (Days)</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, expires_in_days: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="7 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? 'Creating...' : 'Create Invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No invitations created yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first invitation using the form above</p>
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
                    <TableCell className="font-mono text-sm">{invitation.invitation_code}</TableCell>
                    <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                    <TableCell>{invitation.email || '-'}</TableCell>
                    <TableCell>{invitation.project_name || '-'}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyInvitationCode(invitation.invitation_code)}
                        >
                          <Copy size={12} className="mr-1" />
                          Code
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyInvitationLink(invitation.invitation_code)}
                        >
                          <Mail size={12} className="mr-1" />
                          Link
                        </Button>
                        {invitation.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeInvitation(invitation.id)}
                          >
                            <Trash2 size={12} className="mr-1" />
                            Revoke
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
