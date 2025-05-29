
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Package, CheckCircle, DollarSign, UserPlus, Settings } from 'lucide-react';
import { User } from '@/types';
import { formatCurrency } from '@/utils/currency';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import VerificationDashboard from '@/components/verification/VerificationDashboard';
import InvitationManager from '@/components/invitations/InvitationManager';
import UserManagement from '@/components/users/UserManagement';

interface ManagerDashboardProps {
  user: User;
}

const ManagerDashboard = ({ user }: ManagerDashboardProps) => {
  const [stats] = useState({
    totalWorkersPaid: 42,
    materialsDelivered: 156,
    projectsCompleted: 8,
    totalSpent: 15750000,
    pendingApprovals: 5,
    activeTeamMembers: 23,
  });

  const quickStatsCards = [
    {
      title: 'Total Workers Paid',
      value: stats.totalWorkersPaid,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      suffix: 'workers'
    },
    {
      title: 'Materials Delivered',
      value: stats.materialsDelivered,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      suffix: 'deliveries'
    },
    {
      title: 'Projects Completed',
      value: stats.projectsCompleted,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      suffix: 'projects'
    },
    {
      title: 'Total Spent',
      value: stats.totalSpent,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      suffix: '',
      isCurrency: true
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user.name}
          </h1>
          <p className="font-roboto text-gray-600 mt-2">
            Manage your construction projects and team
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStatsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.isCurrency 
                          ? formatCurrency(stat.value, 'NGN')
                          : stat.value.toLocaleString()
                        }
                        {stat.suffix && (
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            {stat.suffix}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="invitations">
              <UserPlus size={16} className="mr-2" />
              Invitations
            </TabsTrigger>
            <TabsTrigger value="users">Team</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings size={16} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="verification" className="mt-6">
            <VerificationDashboard />
          </TabsContent>

          <TabsContent value="invitations" className="mt-6">
            <InvitationManager />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Project configuration and settings will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboard;
