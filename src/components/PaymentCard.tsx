
import { Calendar, DollarSign, Wallet, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentRecord } from '@/types';
import { formatDualCurrency } from '@/utils/currency';

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

  const getTransactionStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-roboto font-semibold text-gray-900">
            {payment.description}
          </CardTitle>
          <div className="flex flex-col space-y-1">
            <Badge className={getStatusColor(payment.status)}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
            {payment.transaction_status && (
              <Badge className={getTransactionStatusColor(payment.transaction_status)}>
                {payment.transaction_status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign size={16} className="text-primary" />
              <div className="flex flex-col">
                <span className="font-roboto font-semibold text-xl text-gray-900">
                  {formatDualCurrency(payment.amount)}
                </span>
                <span className="text-xs text-gray-500">
                  Rate: 1 USD = ₦1,600
                </span>
              </div>
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

          {payment.recipient_wallet && (
            <div className="flex items-center space-x-2">
              <Wallet size={14} className="text-gray-500" />
              <span className="text-xs text-gray-500 font-mono break-all">
                {payment.recipient_wallet}
              </span>
            </div>
          )}
          
          {payment.transaction_hash && (
            <div className="flex items-center space-x-2">
              <ExternalLink size={14} className="text-gray-500" />
              <span className="text-xs text-gray-500 font-mono break-all">
                {payment.transaction_hash}
              </span>
            </div>
          )}

          {payment.smart_contract_address && (
            <p className="text-xs text-gray-500 font-mono">
              Contract: {payment.smart_contract_address}
            </p>
          )}

          {payment.gas_fee && (
            <p className="text-xs text-gray-500">
              Gas Fee: {payment.gas_fee} ETH
            </p>
          )}

          {userRole === 'manager' && payment.status === 'pending' && (
            <div className="flex space-x-2 pt-3">
              <Button
                onClick={() => onApprove?.(payment.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Approve & Send
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
