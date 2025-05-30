
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, Package } from 'lucide-react';

interface AssignedUser {
  id: string;
  user_id: string;
  project_name?: string;
  assigned_at: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const USER_ASSIGNMENTS_KEY = 'contrust_dev_user_assignments';

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

  const getCurrentManagerId = () => {
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    }
    return 'manager-default';
  };

  const fetchAssignedUsers = async () => {
    try {
      const managerId = getCurrentManagerId();
      const storedAssignments = localStorage.getItem(USER_ASSIGNMENTS_KEY);
      
      if (storedAssignments) {
        const allAssignments = JSON.parse(storedAssignments);
        const managerAssignments = allAssignments.filter((assignment: AssignedUser) => 
          assignment.admin_id === managerId
        );
        
        setAssignedUsers(managerAssignments);
        setStats({
          totalUsers: managerAssignments.length,
          activeWorkers: managerAssignments.filter((u: AssignedUser) => u.role === 'worker').length,
          activeSuppliers: managerAssignments.filter((u: AssignedUser) => u.role === 'supplier').length,
        });
      } else {
        // No assignments found
        setAssignedUsers([]);
        setStats({
          totalUsers: 0,
          activeWorkers: 0,
          activeSuppliers: 0,
        });
      }
    } catch (error: any) {
      console.error('Error fetching assigned users:', error);
      setAssignedUsers([]);
      setStats({
        totalUsers: 0,
        activeWorkers: 0,
        activeSuppliers: 0,
      });
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
          <CardTitle>Your Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No team members assigned yet</p>
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
