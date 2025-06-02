
import { useState, useEffect } from 'react';
import { User } from '@/types';
import MaterialUploadForm from '@/components/uploads/MaterialUploadForm';
import WorkUploadForm from '@/components/uploads/WorkUploadForm';
import WalletSetup from '@/components/wallet/WalletSetup';
import VerificationDashboard from '@/components/verification/VerificationDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Uploads = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('current_user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      // Mock user for development if no stored user
      const mockUser: User = {
        id: 'dev-user-' + Math.random().toString(36).substr(2, 9),
        name: 'Development User',
        email: 'dev@example.com',
        role: 'worker',
        created_at: new Date().toISOString(),
      };

      // Check if there's a stored user role from previous navigation
      const storedRole = localStorage.getItem('dev_user_role');
      if (storedRole && (storedRole === 'worker' || storedRole === 'supplier' || storedRole === 'manager')) {
        mockUser.role = storedRole as any;
      }

      setUser(mockUser);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 font-roboto text-gray-600">Loading...</p>
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

  const handleUploadComplete = () => {
    // Refresh or update any relevant state
    console.log('Upload completed successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
            Upload & Verify
          </h1>
          <p className="font-roboto text-gray-600 mt-2">
            Upload work progress, materials, and manage your wallet settings
          </p>
          <p className="font-roboto text-sm text-blue-600 mt-1">
            Current role: {user.role} | User ID: {user.id} | Name: {user.name}
          </p>
        </div>

        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallet">Wallet Setup</TabsTrigger>
            {user.role === 'worker' && (
              <TabsTrigger value="work">Work Progress</TabsTrigger>
            )}
            {user.role === 'supplier' && (
              <TabsTrigger value="materials">Materials</TabsTrigger>
            )}
            {user.role === 'manager' && (
              <TabsTrigger value="verify">Verification</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="wallet" className="mt-6">
            <WalletSetup userId={user.id} />
          </TabsContent>

          {user.role === 'worker' && (
            <TabsContent value="work" className="mt-6">
              <WorkUploadForm userId={user.id} onUploadComplete={handleUploadComplete} />
            </TabsContent>
          )}

          {user.role === 'supplier' && (
            <TabsContent value="materials" className="mt-6">
              <MaterialUploadForm userId={user.id} onUploadComplete={handleUploadComplete} />
            </TabsContent>
          )}

          {user.role === 'manager' && (
            <TabsContent value="verify" className="mt-6">
              <VerificationDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Uploads;
