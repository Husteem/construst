import { useState, useEffect } from 'react';
import { Wallet, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserWallet } from '@/types';

interface WalletSetupProps {
  userId: string;
}

const WalletSetup = ({ userId }: WalletSetupProps) => {
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newWallet, setNewWallet] = useState({
    wallet_address: '',
    wallet_type: 'ethereum' as const,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWallets();
  }, [userId]);

  const fetchWallets = async () => {
    const { data, error } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wallets:', error);
    } else {
      setWallets(data || []);
    }
  };

  const handleAddWallet = async () => {
    if (!newWallet.wallet_address) {
      toast({
        title: "Invalid wallet address",
        description: "Please enter a valid wallet address.",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const { error } = await supabase
        .from('user_wallets')
        .insert({
          user_id: userId,
          wallet_address: newWallet.wallet_address,
          wallet_type: newWallet.wallet_type,
          is_primary: wallets.length === 0, // First wallet is primary
        });

      if (error) throw error;

      toast({
        title: "Wallet added successfully!",
        description: "Your wallet has been registered for payments.",
      });

      setNewWallet({ wallet_address: '', wallet_type: 'ethereum' });
      fetchWallets();
    } catch (error) {
      toast({
        title: "Failed to add wallet",
        description: "There was an error adding your wallet.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const setPrimaryWallet = async (walletId: string) => {
    try {
      // First, set all wallets to non-primary
      await supabase
        .from('user_wallets')
        .update({ is_primary: false })
        .eq('user_id', userId);

      // Then set the selected wallet as primary
      const { error } = await supabase
        .from('user_wallets')
        .update({ is_primary: true })
        .eq('id', walletId);

      if (error) throw error;

      toast({
        title: "Primary wallet updated",
        description: "Your primary wallet has been changed.",
      });

      fetchWallets();
    } catch (error) {
      toast({
        title: "Failed to update wallet",
        description: "There was an error updating your primary wallet.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-xl flex items-center space-x-2">
          <Wallet size={20} className="text-primary" />
          <span>Wallet Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Existing Wallets */}
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium capitalize">{wallet.wallet_type}</span>
                  {wallet.is_primary && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-mono break-all">
                  {wallet.wallet_address}
                </p>
              </div>
              {!wallet.is_primary && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPrimaryWallet(wallet.id)}
                >
                  Set Primary
                </Button>
              )}
            </div>
          ))}

          {/* Add New Wallet */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="wallet_type">Wallet Type</Label>
                <Select
                  value={newWallet.wallet_type}
                  onValueChange={(value: 'ethereum' | 'bitcoin' | 'polygon') =>
                    setNewWallet(prev => ({ ...prev, wallet_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                    <SelectItem value="polygon">Polygon (MATIC)</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="wallet_address">Wallet Address</Label>
                <Input
                  id="wallet_address"
                  value={newWallet.wallet_address}
                  onChange={(e) => setNewWallet(prev => ({ ...prev, wallet_address: e.target.value }))}
                  placeholder="0x1234567890abcdef..."
                  className="font-mono"
                />
              </div>

              <Button
                onClick={handleAddWallet}
                disabled={isAdding}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                {isAdding ? 'Adding...' : 'Add Wallet'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSetup;
