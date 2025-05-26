
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import WorkerDashboard from '@/components/dashboards/WorkerDashboard';
import SupplierDashboard from '@/components/dashboards/SupplierDashboard';
import ManagerDashboard from '@/components/dashboards/ManagerDashboard';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('contrust_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 font-roboto text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'worker':
        return <WorkerDashboard user={user} />;
      case 'supplier':
        return <SupplierDashboard user={user} />;
      case 'manager':
        return <ManagerDashboard user={user} />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
