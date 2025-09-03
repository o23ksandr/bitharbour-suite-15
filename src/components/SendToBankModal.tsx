import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useState } from 'react';
interface Currency {
  symbol: string;
  balance: number;
  name: string;
}
interface SendToBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currencies: Currency[];
}
export default function SendToBankModal({
  open,
  onOpenChange,
  currencies
}: SendToBankModalProps) {
  const [amount, setAmount] = useState('');
  const [iban, setIban] = useState('');
  const [bicSwift, setBicSwift] = useState('');
  const [payerName, setPayerName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Get available balance for selected currency
  const currentCurrency = currencies.find(c => c.symbol === selectedCurrency);
  const availableBalance = currentCurrency?.balance || 0;
  const handleMaxAmount = () => {
    setAmount(availableBalance.toString());
  };
  const handleSubmit = () => {
    // Handle form submission
    console.log('Send to bank request submitted');
    onOpenChange(false);
  };

  // Determine which step is active based on filled data
  const getActiveStep = () => {
    if (!selectedCurrency || !amount) return 1;
    if (!iban || !bicSwift) return 2;
    if (!payerName || !billingAddress || !postalCode || !country || !city) return 3;
    return 4; // All completed
  };
  const activeStep = getActiveStep();
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < activeStep) return 'completed';
    if (stepNumber === activeStep) return 'active';
    return 'inactive';
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 md:p-6">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-4 pt-4 md:px-0 md:pt-0">
          <DialogTitle className="text-xl font-semibold">Create Send Request</DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-y-auto px-4 md:px-0">
          {/* Vertical connecting line between steps 1-2 */}
          <div className="absolute left-4 top-8 h-32 w-px bg-border hidden md:block"></div>
          {/* Vertical connecting line between steps 2-3 */}
          <div className="absolute left-4 top-48 h-32 w-px bg-border hidden md:block"></div>
          
          <div className="space-y-6">
          {/* Step 1: Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium relative z-10 ${getStepStatus(1) === 'completed' ? 'bg-primary text-primary-foreground' : getStepStatus(1) === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
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
                    {currencies.filter(currency => ['USD', 'EUR', 'GBP'].includes(currency.symbol)).map(currency => <SelectItem key={currency.symbol} value={currency.symbol}>
                        $ {currency.symbol} {currency.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Input id="amount" type="number" placeholder="Enter amount to send" value={amount} onChange={e => setAmount(e.target.value)} className="pr-16" />
                  <Button type="button" variant="link" size="sm" onClick={handleMaxAmount} className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-0 text-primary">
                    Max.
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Available Balance: {availableBalance} {selectedCurrency}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Send to Bank */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium relative z-10 ${getStepStatus(2) === 'completed' ? 'bg-primary text-primary-foreground' : getStepStatus(2) === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <h3 className={`text-lg font-medium ${getStepStatus(2) === 'inactive' ? 'text-muted-foreground' : ''}`}>
                Send to Bank
              </h3>
            </div>

            <div className="space-y-4 ml-0 md:ml-11">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" placeholder="E.g. DE44 1234 5678 9012 3456 78" value={iban} onChange={e => setIban(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bic-swift">BIC/SWIFT</Label>
                <Input id="bic-swift" placeholder="E.g. ABCDUS33XXX" value={bicSwift} onChange={e => setBicSwift(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Step 3: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium relative z-10 ${getStepStatus(3) === 'completed' ? 'bg-primary text-primary-foreground' : getStepStatus(3) === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <h3 className={`text-lg font-medium ${getStepStatus(3) === 'inactive' ? 'text-muted-foreground' : ''}`}>
                Personal Information
              </h3>
            </div>

            <div className="space-y-4 ml-0 md:ml-11">
              <div className="space-y-2">
                <Label htmlFor="payer-name">Payer Full Name</Label>
                <Input id="payer-name" placeholder="Alexandra Thompson" value={payerName} onChange={e => setPayerName(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billing-address">Billing Address</Label>
                  <Input id="billing-address" placeholder="E.g. 123 Elm Street" value={billingAddress} onChange={e => setBillingAddress(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" placeholder="6-digits code" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="!bg-background !border !z-[100]">
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="ua">Ukraine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select town" />
                    </SelectTrigger>
                    <SelectContent className="!bg-background !border !z-[100]">
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="berlin">Berlin</SelectItem>
                      <SelectItem value="paris">Paris</SelectItem>
                      <SelectItem value="kyiv">Kyiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col gap-3 pt-4 px-4 pb-4 md:px-0 md:pb-0 md:flex-row md:justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="order-2 md:order-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 order-1 md:order-2">
              Request Send {amount || '0'} {selectedCurrency}
            </Button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>;
}