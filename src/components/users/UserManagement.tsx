
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AssignedUser {
  id: string;
  user_id: string;
  project_name?: string;
  assigned_at: string;
  // Mock user data since we don't have real auth
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const UserManagement = () => {
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeWorkers: 0,
    activeSuppliers: 0,
  });

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  const fetchAssignedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_assignments')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (error) throw error;

      // Mock user data for demonstration
      const mockUsers: AssignedUser[] = (data || []).map((assignment, index) => ({
        ...assignment,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: index % 2 === 0 ? 'worker' : 'supplier',
        status: 'active' as const,
      }));

      // Add some sample data if no assignments exist
      if (mockUsers.length === 0) {
        const sampleUsers: AssignedUser[] = [
          {
            id: '1',
            user_id: 'user1',
            project_name: 'Building Construction Phase 1',
            assigned_at: new Date().toISOString(),
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'worker',
            status: 'active',
          },
          {
            id: '2',
            user_id: 'user2',
            project_name: 'Road Infrastructure',
            assigned_at: new Date().toISOString(),
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'supplier',
            status: 'active',
          },
          {
            id: '3',
            user_id: 'user3',
            project_name: 'Building Construction Phase 1',
            assigned_at: new Date().toISOString(),
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: 'worker',
            status: 'active',
          },
        ];
        setAssignedUsers(sampleUsers);
        
        setStats({
          totalUsers: 3,
          activeWorkers: 2,
          activeSuppliers: 1,
        });
      } else {
        setAssignedUsers(mockUsers);
        
        setStats({
          totalUsers: mockUsers.length,
          activeWorkers: mockUsers.filter(u => u.role === 'worker').length,
          activeSuppliers: mockUsers.filter(u => u.role === 'supplier').length,
        });
      }
    } catch (error: any) {
      console.error('Error fetching assigned users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'worker':
        return <Badge variant="default" className="bg-blue-500"><UserCheck size={12} className="mr-1" />Worker</Badge>;
      case 'supplier':
        return <Badge variant="default" className="bg-green-500"><Package size={12} className="mr-1" />Supplier</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
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
      <div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
          User Management
        </h2>
        <p className="text-gray-600">Manage your team members and their assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Workers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeWorkers}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <UserCheck size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSuppliers}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Package size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Users</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users assigned yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Create invitations to add workers and suppliers to your projects
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.project_name || '-'}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.assigned_at).toLocaleDateString()}</TableCell>
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

export default UserManagement;
