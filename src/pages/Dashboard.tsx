
import { useState, useEffect } from 'react';
import ManagerDashboard from '@/components/dashboards/ManagerDashboard';

const Dashboard = () => {
  // Mock user for development - no authentication required
  const mockUser = {
    id: 'dev-user-1',
    name: 'Development User',
    email: 'dev@contrust.com',
    role: 'manager' as const
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerDashboard user={mockUser} />
    </div>
  );
};

export default Dashboard;
