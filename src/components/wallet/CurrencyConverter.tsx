
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpDown } from 'lucide-react';
import { convertNgnToUsd, convertUsdToNgn, formatCurrency, USD_TO_NGN_RATE } from '@/utils/currency';

const CurrencyConverter = () => {
  const [ngnAmount, setNgnAmount] = useState<string>('');
  const [usdAmount, setUsdAmount] = useState<string>('');

  const handleNgnChange = (value: string) => {
    setNgnAmount(value);
    const numValue = parseFloat(value) || 0;
    setUsdAmount(convertNgnToUsd(numValue).toFixed(2));
  };

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    const numValue = parseFloat(value) || 0;
    setNgnAmount(convertUsdToNgn(numValue).toFixed(0));
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-playfair text-lg flex items-center space-x-2">
          <ArrowUpDown size={18} className="text-primary" />
          <span>Currency Converter</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center text-sm text-gray-600 font-roboto">
            Exchange Rate: 1 USD = ₦{USD_TO_NGN_RATE.toLocaleString()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ngn-amount">Nigerian Naira (₦)</Label>
              <Input
                id="ngn-amount"
                type="number"
                value={ngnAmount}
                onChange={(e) => handleNgnChange(e.target.value)}
                placeholder="Enter NGN amount"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usd-amount">US Dollar ($)</Label>
              <Input
                id="usd-amount"
                type="number"
                value={usdAmount}
                onChange={(e) => handleUsdChange(e.target.value)}
                placeholder="Enter USD amount"
                step="0.01"
              />
            </div>
          </div>
          
          {ngnAmount && usdAmount && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-roboto">
                <span className="font-semibold">{formatCurrency(parseFloat(ngnAmount), 'NGN')}</span>
                {' = '}
                <span className="font-semibold">{formatCurrency(parseFloat(usdAmount), 'USD')}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
