
import { useState, useEffect } from 'react';
import { User } from '@/types';
import WorkerDashboard from '@/components/dashboards/WorkerDashboard';
import SupplierDashboard from '@/components/dashboards/SupplierDashboard';
import ManagerDashboard from '@/components/dashboards/ManagerDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user for development
  const createMockUser = (role: 'worker' | 'supplier' | 'manager'): User => ({
    id: 'dev-user-' + Math.random().toString(36).substr(2, 9),
    name: `Development ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    email: `dev-${role}@example.com`,
    role: role,
    created_at: new Date().toISOString(),
  });

  useEffect(() => {
    // Get stored role or default to manager
    const storedRole = localStorage.getItem('dev_user_role') as 'worker' | 'supplier' | 'manager' || 'manager';
    setUser(createMockUser(storedRole));
    setIsLoading(false);
  }, []);

  const switchRole = (newRole: 'worker' | 'supplier' | 'manager') => {
    localStorage.setItem('dev_user_role', newRole);
    setUser(createMockUser(newRole));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 font-roboto text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="font-roboto text-gray-600">Unable to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Development Role Switcher */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-roboto text-sm text-blue-600 font-medium">
                Development Mode - Current Role: {user.role}
              </p>
              <p className="font-roboto text-xs text-blue-500">
                Switch roles to test different user experiences
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={user.role === 'manager' ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchRole('manager')}
              >
                Manager
              </Button>
              <Button
                variant={user.role === 'worker' ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchRole('worker')}
              >
                Worker
              </Button>
              <Button
                variant={user.role === 'supplier' ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchRole('supplier')}
              >
                Supplier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {user.role === 'worker' && <WorkerDashboard user={user} />}
      {user.role === 'supplier' && <SupplierDashboard user={user} />}
      {user.role === 'manager' && <ManagerDashboard user={user} />}
    </div>
  );
};

export default Dashboard;
