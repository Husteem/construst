
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, PaymentRecord } from '@/types';
import PaymentCard from '@/components/PaymentCard';

interface ManagerDashboardProps {
  user: User;
}

const ManagerDashboard = ({ user }: ManagerDashboardProps) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for demo with recipient names
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        amount: 25000,
        status: 'pending',
        date: '2025-01-25',
        description: 'Foundation work - Week 3',
        recipient_id: 'worker1',
        recipient_name: 'Ahmad Ibrahim',
        created_at: '2025-01-25T09:00:00Z',
      },
      {
        id: '2',
        amount: 45000,
        status: 'pending',
        date: '2025-01-24',
        description: 'Sand delivery - 10 trips',
        recipient_id: 'supplier1',
        recipient_name: 'Kano Materials Ltd',
        created_at: '2025-01-24T11:00:00Z',
      },
      {
        id: '3',
        amount: 30000,
        status: 'approved',
        date: '2025-01-22',
        description: 'Roofing installation',
        recipient_id: 'worker2',
        recipient_name: 'Fatima Aliyu',
        created_at: '2025-01-22T14:00:00Z',
      },
      {
        id: '4',
        amount: 75000,
        status: 'paid',
        date: '2025-01-21',
        description: 'Steel bars delivery',
        recipient_id: 'supplier2',
        recipient_name: 'Northern Steel Co.',
        transaction_hash: '0x9876...ijkl',
        created_at: '2025-01-21T15:00:00Z',
      },
      {
        id: '5',
        amount: 20000,
        status: 'rejected',
        date: '2025-01-20',
        description: 'Overtime work claim',
        recipient_id: 'worker3',
        recipient_name: 'Musa Garba',
        created_at: '2025-01-20T16:00:00Z',
      },
    ];

    setPayments(mockPayments);
  }, []);

  const handleApprove = async (paymentId: string) => {
    setIsProcessing(paymentId);

    // Simulate blockchain transaction
    setTimeout(() => {
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: 'approved',
              approver_id: user.id,
              transaction_hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
            }
          : payment
      ));

      setIsProcessing(null);

      // Simulate smart contract execution after a delay
      setTimeout(() => {
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'paid' }
            : payment
        ));

        toast({
          title: "Payment processed!",
          description: "Smart contract executed and payment released successfully.",
        });
      }, 2000);

      toast({
        title: "Payment approved!",
        description: "Smart contract is processing the payment...",
      });
    }, 1500);
  };

  const handleReject = async (paymentId: string) => {
    setIsProcessing(paymentId);

    setTimeout(() => {
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'rejected', approver_id: user.id }
          : payment
      ));

      setIsProcessing(null);

      toast({
        title: "Payment rejected",
        description: "The payment request has been declined.",
        variant: "destructive",
      });
    }, 1000);
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalApproved = payments
    .filter(p => p.status === 'approved' || p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

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
            Manager Dashboard
          </h1>
          <p className="font-roboto text-gray-600 mt-2">
            Review and approve payment requests from workers and suppliers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <AlertCircle className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Pending Requests</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {pendingPayments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <DollarSign className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Pending Amount</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {formatCurrency(totalPending)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Total Approved</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {formatCurrency(totalApproved)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Total Requests</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {payments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingPayments.length > 0 && (
          <div className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <span>Pending Approval</span>
            </h2>
            <div className="grid gap-4">
              {pendingPayments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  userRole="manager"
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Payment Requests */}
        <div>
          <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">
            All Payment Requests
          </h2>
          <div className="grid gap-4">
            {payments
              .filter(p => p.status !== 'pending')
              .map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  userRole="manager"
                />
              ))}
          </div>
        </div>

        {/* Smart Contract Info */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="font-playfair text-lg text-primary flex items-center space-x-2">
              <CheckCircle size={20} />
              <span>Smart Contract Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-roboto text-gray-700">
              Payments are automatically processed through smart contracts on the Ethereum blockchain. 
              Once approved, funds are released instantly and securely to recipients.
            </p>
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <p className="font-roboto text-sm text-gray-600">
                <strong>Contract Address:</strong> 0x742d35Cc6cF6A2bC1a4B0e0B0e1b0e1b0e1b0e1b (Simulated)
              </p>
              <p className="font-roboto text-sm text-gray-600 mt-1">
                <strong>Network:</strong> Ethereum Mainnet (Simulated for demo)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
