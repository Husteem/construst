
import { Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentRecord } from '@/types';

interface PaymentCardProps {
  payment: PaymentRecord;
  userRole: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const PaymentCard = ({ payment, userRole, onApprove, onReject }: PaymentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-roboto font-semibold text-gray-900">
            {payment.description}
          </CardTitle>
          <Badge className={getStatusColor(payment.status)}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign size={16} className="text-primary" />
              <span className="font-roboto font-semibold text-xl text-gray-900">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar size={14} />
              <span className="font-roboto text-sm">
                {new Date(payment.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {payment.recipient_name && (
            <p className="text-sm text-gray-600 font-roboto">
              To: {payment.recipient_name}
            </p>
          )}
          
          {payment.transaction_hash && (
            <p className="text-xs text-gray-500 font-mono break-all">
              Tx: {payment.transaction_hash}
            </p>
          )}

          {userRole === 'manager' && payment.status === 'pending' && (
            <div className="flex space-x-2 pt-3">
              <Button
                onClick={() => onApprove?.(payment.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Approve
              </Button>
              <Button
                onClick={() => onReject?.(payment.id)}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                size="sm"
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
