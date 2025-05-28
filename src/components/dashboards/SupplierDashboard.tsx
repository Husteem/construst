import { useState, useEffect } from 'react';
import { Package, DollarSign, Plus, Truck, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, PaymentRecord, DeliveryLog } from '@/types';
import PaymentCard from '@/components/PaymentCard';
import { Link } from 'react-router-dom';

interface SupplierDashboardProps {
  user: User;
}

const SupplierDashboard = ({ user }: SupplierDashboardProps) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryLog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    materialType: '',
    quantity: '',
    unitPrice: '',
    deliveryDate: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    // Mock data with enhanced wallet information
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        amount: 150000,
        status: 'paid',
        date: '2025-01-18',
        description: 'Cement delivery - 50 bags',
        recipient_id: user.id,
        transaction_hash: '0x5678...efgh',
        recipient_wallet: '0x742d35Cc6cF6A2bC1a4B0e0B0e1b0e1b0e1b0e1b',
        transaction_status: 'completed',
        smart_contract_address: '0xContract123',
        gas_fee: 0.0035,
        created_at: '2025-01-18T12:00:00Z',
      },
      {
        id: '2',
        amount: 75000,
        status: 'approved',
        date: '2025-01-21',
        description: 'Steel bars delivery',
        recipient_id: user.id,
        created_at: '2025-01-21T15:00:00Z',
      },
      {
        id: '3',
        amount: 45000,
        status: 'pending',
        date: '2025-01-24',
        description: 'Sand delivery - 10 trips',
        recipient_id: user.id,
        created_at: '2025-01-24T11:00:00Z',
      },
    ];

    const mockDeliveries: DeliveryLog[] = [
      {
        id: '1',
        supplier_id: user.id,
        material_type: 'Cement',
        quantity: 50,
        unit_price: 3000,
        total_amount: 150000,
        delivery_date: '2025-01-18',
        status: 'paid',
        created_at: '2025-01-18T12:00:00Z',
      },
      {
        id: '2',
        supplier_id: user.id,
        material_type: 'Steel bars',
        quantity: 25,
        unit_price: 3000,
        total_amount: 75000,
        delivery_date: '2025-01-21',
        status: 'delivered',
        created_at: '2025-01-21T15:00:00Z',
      },
    ];

    setPayments(mockPayments);
    setDeliveries(mockDeliveries);
  }, [user.id]);

  const handleSubmitDelivery = async () => {
    if (!deliveryForm.materialType || !deliveryForm.quantity || !deliveryForm.unitPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const totalAmount = parseFloat(deliveryForm.quantity) * parseFloat(deliveryForm.unitPrice);
      
      const newDelivery: DeliveryLog = {
        id: Date.now().toString(),
        supplier_id: user.id,
        material_type: deliveryForm.materialType,
        quantity: parseFloat(deliveryForm.quantity),
        unit_price: parseFloat(deliveryForm.unitPrice),
        total_amount: totalAmount,
        delivery_date: deliveryForm.deliveryDate,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      setDeliveries(prev => [newDelivery, ...prev]);

      // Create a pending payment request
      const newPayment: PaymentRecord = {
        id: Date.now().toString() + '_payment',
        amount: totalAmount,
        status: 'pending',
        date: deliveryForm.deliveryDate,
        description: `${deliveryForm.materialType} delivery - ${deliveryForm.quantity} units`,
        recipient_id: user.id,
        created_at: new Date().toISOString(),
      };

      setPayments(prev => [newPayment, ...prev]);

      setDeliveryForm({
        materialType: '',
        quantity: '',
        unitPrice: '',
        deliveryDate: new Date().toISOString().split('T')[0],
      });
      setIsSubmitting(false);

      toast({
        title: "Delivery submitted successfully!",
        description: `${deliveryForm.materialType} delivery recorded and payment requested.`,
      });
    }, 1000);
  };

  const totalEarnings = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending' || p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDeliveries = deliveries.length;

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
            Manage your material deliveries and track payments
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/uploads">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Upload className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="font-roboto font-semibold text-gray-900">Upload Materials</p>
                    <p className="font-roboto text-sm text-gray-600">Add photos and details of deliveries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/uploads">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="font-roboto font-semibold text-gray-900">Setup Wallet</p>
                    <p className="font-roboto text-sm text-gray-600">Add your crypto wallet for payments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
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
                  <Package className="text-yellow-600" size={24} />
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
                  <Truck className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="font-roboto text-sm text-gray-600">Total Deliveries</p>
                  <p className="font-roboto text-2xl font-bold text-gray-900">
                    {totalDeliveries}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Delivery Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-playfair text-xl flex items-center space-x-2">
              <Plus size={20} className="text-primary" />
              <span>Submit Material Delivery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="materialType" className="font-roboto font-medium">Material Type</Label>
                <Input
                  id="materialType"
                  placeholder="e.g., Cement, Steel bars"
                  value={deliveryForm.materialType}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, materialType: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="quantity" className="font-roboto font-medium">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="50"
                  value={deliveryForm.quantity}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="unitPrice" className="font-roboto font-medium">Unit Price (₦)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="3000"
                  value={deliveryForm.unitPrice}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate" className="font-roboto font-medium">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryForm.deliveryDate}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="font-roboto text-sm text-gray-600">
                Total: {deliveryForm.quantity && deliveryForm.unitPrice 
                  ? formatCurrency(parseFloat(deliveryForm.quantity) * parseFloat(deliveryForm.unitPrice))
                  : '₦0'
                }
              </p>
              <Button
                onClick={handleSubmitDelivery}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Delivery & Request Payment'}
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
                userRole="supplier"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
