import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Currency {
  symbol: string;
  balance: number;
  name: string;
}

interface SendToCryptoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currencies: Currency[];
}

export default function SendToCryptoModal({
  open,
  onOpenChange,
  currencies
}: SendToCryptoModalProps) {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');

  // Get available balance for selected currency
  const currentCurrency = currencies.find(c => c.symbol === selectedCurrency);
  const availableBalance = currentCurrency?.balance || 0;

  const handleMaxAmount = () => {
    setAmount(availableBalance.toString());
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Send to crypto wallet request submitted');
    onOpenChange(false);
  };

  // Determine which step is active based on filled data
  const getActiveStep = () => {
    if (!selectedCurrency || !amount) return 1;
    if (!walletAddress || !selectedNetwork) return 2;
    return 3; // All completed
  };

  const activeStep = getActiveStep();

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < activeStep) return 'completed';
    if (stepNumber === activeStep) return 'active';
    return 'inactive';
  };

  // Get available networks for selected currency
  const getNetworksForCurrency = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return [
          { value: 'bitcoin', label: 'Bitcoin Network' },
          { value: 'lightning', label: 'Lightning Network' }
        ];
      case 'ETH':
        return [
          { value: 'ethereum', label: 'Ethereum Mainnet' },
          { value: 'polygon', label: 'Polygon' },
          { value: 'arbitrum', label: 'Arbitrum' },
          { value: 'optimism', label: 'Optimism' }
        ];
      case 'USDT':
        return [
          { value: 'ethereum', label: 'Ethereum (ERC-20)' },
          { value: 'tron', label: 'Tron (TRC-20)' },
          { value: 'bsc', label: 'BNB Smart Chain (BEP-20)' },
          { value: 'polygon', label: 'Polygon' }
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 md:p-6">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-4 pt-4 md:px-0 md:pt-0">
          <DialogTitle className="text-xl font-semibold">Send to Crypto Wallet</DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-y-auto px-4 md:px-0">
          {/* Vertical connecting line between steps */}
          <div className="absolute left-4 top-8 h-32 w-px bg-border hidden md:block"></div>
          
          <div className="space-y-6">
            {/* Step 1: Transaction Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium relative z-10 ${
                  getStepStatus(1) === 'completed' ? 'bg-primary text-primary-foreground' : 
                  getStepStatus(1) === 'active' ? 'bg-primary text-primary-foreground' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <h3 className="text-lg font-medium">Transaction Details</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 ml-0 md:ml-11 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source-wallet">Source Wallet</Label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="!bg-background !border !z-[100]">
                      {currencies.filter(currency => ['BTC', 'ETH', 'USDT'].includes(currency.symbol)).map(currency => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          {currency.symbol} {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="Enter amount to send" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                      className="pr-16" 
                    />
                    <Button 
                      type="button" 
                      variant="link" 
                      size="sm" 
                      onClick={handleMaxAmount} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-0 text-primary"
                    >
                      Max.
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Available Balance: {availableBalance} {selectedCurrency}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Wallet Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium relative z-10 ${
                  getStepStatus(2) === 'completed' ? 'bg-primary text-primary-foreground' : 
                  getStepStatus(2) === 'active' ? 'bg-primary text-primary-foreground' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <h3 className={`text-lg font-medium ${getStepStatus(2) === 'inactive' ? 'text-muted-foreground' : ''}`}>
                  Destination Wallet
                </h3>
              </div>

              <div className="space-y-4 ml-0 md:ml-11">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input 
                    id="wallet-address" 
                    placeholder={`Enter ${selectedCurrency} wallet address`}
                    value={walletAddress} 
                    onChange={e => setWalletAddress(e.target.value)} 
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network">Blockchain Network</Label>
                  <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent className="!bg-background !border !z-[100]">
                      {getNetworksForCurrency(selectedCurrency).map(network => (
                        <SelectItem key={network.value} value={network.value}>
                          {network.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Make sure the address and network are correct. Transactions cannot be reversed.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col gap-3 pt-4 px-4 pb-4 md:px-0 md:pb-0 md:flex-row md:justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="order-2 md:order-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!amount || !walletAddress || !selectedNetwork}
                className="bg-primary hover:bg-primary/90 order-1 md:order-2"
              >
                Send {amount || '0'} {selectedCurrency}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}