
import { useState, useEffect } from 'react';
import { Clock, DollarSign, Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User, PaymentRecord, WorkLog } from '@/types';
import PaymentCard from '@/components/PaymentCard';

interface WorkerDashboardProps {
  user: User;
}

const WorkerDashboard = ({ user }: WorkerDashboardProps) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [logForm, setLogForm] = useState({
    hours: '',
    description: '',
    hourlyRate: '2500', // Default hourly rate in Naira
  });
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for demo
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        amount: 25000,
        status: 'paid',
        date: '2025-01-20',
        description: 'Foundation work - Week 3',
        recipient_id: user.id,
        transaction_hash: '0x1234...abcd',
        created_at: '2025-01-20T10:00:00Z',
      },
      {
        id: '2',
        amount: 30000,
        status: 'approved',
        date: '2025-01-22',
        description: 'Roofing installation',
        recipient_id: user.id,
        created_at: '2025-01-22T14:00:00Z',
      },
      {
        id: '3',
        amount: 20000,
        status: 'pending',
        date: '2025-01-25',
        description: 'Electrical wiring assistance',
        recipient_id: user.id,
        created_at: '2025-01-25T09:00:00Z',
      },
    ];

    const mockWorkLogs: WorkLog[] = [
      {
        id: '1',
        worker_id: user.id,
        hours: 8,
        description: 'Foundation excavation and concrete pouring',
        date: '2025-01-20',
        hourly_rate: 2500,
        created_at: '2025-01-20T16:00:00Z',
      },
      {
        id: '2',
        worker_id: user.id,
        hours: 6,
        description: 'Roof frame installation',
        date: '2025-01-22',
        hourly_rate: 2500,
        created_at: '2025-01-22T18:00:00Z',
      },
    ];

    setPayments(mockPayments);
    setWorkLogs(mockWorkLogs);
  }, [user.id]);

  const handleLogHours = async () => {
    if (!logForm.hours || !logForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLogging(true);

    // Simulate API call
    setTimeout(() => {
      const newWorkLog: WorkLog = {
        id: Date.now().toString(),
        worker_id: user.id,
        hours: parseFloat(logForm.hours),
        description: logForm.description,
        date: new Date().toISOString().split('T')[0],
        hourly_rate: parseFloat(logForm.hourlyRate),
        created_at: new Date().toISOString(),
      };

      setWorkLogs(prev => [newWorkLog, ...prev]);

      // Create a pending payment request
      const newPayment: PaymentRecord = {
        id: Date.now().toString() + '_payment',
        amount: parseFloat(logForm.hours) * parseFloat(logForm.hourlyRate),
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        description: `Work hours: ${logForm.description}`,
        recipient_id: user.id,
        created_at: new Date().toISOString(),
      };

      setPayments(prev => [newPayment, ...prev]);

      setLogForm({ hours: '', description: '', hourlyRate: '2500' });
      setIsLogging(false);

      toast({
        title: "Hours logged successfully!",
        description: `${logForm.hours} hours logged and payment request submitted.`,
      });
    }, 1000);
  };

  const totalEarnings = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending' || p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user.name}
          </h1>
          <p className="font-roboto text-gray-600 mt-2">
            Track your work hours and payment history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Total Earnings</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {formatCurrency(totalEarnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Pending Payments</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {formatCurrency(pendingAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <History className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Hours This Month</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {workLogs.reduce((sum, log) => sum + log.hours, 0)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Hours Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-playfair text-xl flex items-center space-x-2">
              <Plus size={20} className="text-primary" />
              <span>Log Work Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="hours" className="font-roboto font-medium">Hours Worked</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  placeholder="8"
                  value={logForm.hours}
                  onChange={(e) => setLogForm(prev => ({ ...prev, hours: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="hourlyRate" className="font-roboto font-medium">Hourly Rate (₦)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="2500"
                  value={logForm.hourlyRate}
                  onChange={(e) => setLogForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description" className="font-roboto font-medium">Work Description</Label>
                <Input
                  id="description"
                  placeholder="Describe the work performed..."
                  value={logForm.description}
                  onChange={(e) => setLogForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="font-roboto text-sm text-gray-600">
                Total: {logForm.hours && logForm.hourlyRate 
                  ? formatCurrency(parseFloat(logForm.hours) * parseFloat(logForm.hourlyRate))
                  : '₦0'
                }
              </p>
              <Button
                onClick={handleLogHours}
                disabled={isLogging}
                className="bg-primary hover:bg-primary/90"
              >
                {isLogging ? 'Submitting...' : 'Log Hours & Request Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <div>
          <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">
            Payment History
          </h2>
          <div className="grid gap-4">
            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                userRole="worker"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
