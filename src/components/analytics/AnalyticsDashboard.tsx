
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, CheckCircle, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface AnalyticsData {
  totalWorkersPaid: number;
  materialsDelivered: number;
  projectsCompleted: number;
  totalSpent: number;
  pendingPayments: number;
  thisMonthSpent: number;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalWorkersPaid: 42,
    materialsDelivered: 156,
    projectsCompleted: 8,
    totalSpent: 15750000, // in NGN
    pendingPayments: 12,
    thisMonthSpent: 3200000,
  });

  const statsCards = [
    {
      title: 'Total Workers Paid',
      value: analytics.totalWorkersPaid,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      suffix: 'workers'
    },
    {
      title: 'Materials Delivered',
      value: analytics.materialsDelivered,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      suffix: 'deliveries'
    },
    {
      title: 'Projects Completed',
      value: analytics.projectsCompleted,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      suffix: 'projects'
    },
    {
      title: 'Total Spent',
      value: analytics.totalSpent,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      suffix: '',
      isCurrency: true
    },
    {
      title: 'Pending Payments',
      value: analytics.pendingPayments,
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      suffix: 'pending'
    },
    {
      title: 'This Month',
      value: analytics.thisMonthSpent,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      suffix: '',
      isCurrency: true
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
          Project Analytics
        </h2>
        <p className="text-gray-600">Overview of your construction project metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
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
    </div>
  );
};

export default AnalyticsDashboard;
