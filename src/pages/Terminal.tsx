import { useEffect, useState } from 'react';
import SupportFAB from '@/components/SupportFAB';
import SEO from '@/components/SEO';
import HeaderBar from '@/components/HeaderBar';
import UserProfileHeader from '@/components/UserProfileHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Wallet, Transaction, ExchangeQuote, Currency } from '@/types/models';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/auth';
import SendToBankModal from '@/components/SendToBankModal';
import SendToCryptoModal from '@/components/SendToCryptoModal';
async function fetchJSON<T>(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return (await res.json()) as T;
}
export default function Dashboard() {
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const {
    data: wallets
  } = useQuery<Wallet[]>({
    queryKey: ['wallets'],
    queryFn: () => fetchJSON('/api/wallets')
  });
  const {
    data: txRes
  } = useQuery<{
    items: Transaction[];
    total: number;
  }>({
    queryKey: ['tx', {
      page: 1,
      size: 10
    }],
    queryFn: () => fetchJSON('/api/transactions?page=1&size=10&sort=date:desc')
  });
  const [from, setFrom] = useState<Currency>('USD');
  const [to, setTo] = useState<Currency>('USDT');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<ExchangeQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendToBankModalOpen, setSendToBankModalOpen] = useState(false);
  const [sendToCryptoModalOpen, setSendToCryptoModalOpen] = useState(false);

  // User profile data
  const name = user?.fullName || 'Benjamin Dawson';
  const accountId = user?.accountId || '284921';
  const status = user?.status || 'Activated';
  const walletAddress = '34x6gZBQCJqkfNVvDru68EvTZNaRm3FTB2';
  useEffect(() => {
    setQuote(null);
  }, [from, to, amount]);
  const getQuote = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/exchange/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to,
          amount: Number(amount)
        })
      });
      if (!res.ok) throw new Error('Failed to get quote');
      const data = (await res.json()) as ExchangeQuote;
      setQuote(data);
    } catch (e) {
      toast({
        title: 'Quote error',
        description: 'Unable to get quote',
        variant: 'destructive' as any
      });
    } finally {
      setLoading(false);
    }
  };
  const execute = async () => {
    if (!quote) return;
    try {
      setLoading(true);
      const res = await fetch('/api/exchange/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteId: quote.id
        })
      });
      if (!res.ok) throw new Error('Exchange failed');
      toast({
        title: 'Exchange complete',
        description: `${quote.amount} ${quote.from} → ${quote.to}`
      });
      setQuote(null);
      setAmount('');
      await Promise.all([qc.invalidateQueries({
        queryKey: ['wallets']
      }), qc.invalidateQueries({
        queryKey: ['tx']
      })]);
    } catch (e) {
      toast({
        title: 'Exchange failed',
        description: 'Please try again',
        variant: 'destructive' as any
      });
    } finally {
      setLoading(false);
    }
  };
  // Helper functions for transaction display
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'send':
        return;
      case 'deposit':
        return;
      default:
        return null;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>;
      case 'denied':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Denied
          </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const totalUSD = wallets?.reduce((s, w) => s + w.usdEquivalent, 0) ?? 0;
  return <>
      <SEO title="Terminal | BITHARBOUR" description="Wallets, exchange terminal, and latest transactions." />
      <HeaderBar />
      <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section>
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Terminal</h1>
            <p className="text-sm text-muted-foreground">Exchange cryptocurrencies and manage your wallets</p>
          </header>
          
          <div className="mt-6">
            <UserProfileHeader name={name} accountId={accountId} status={status} balance={totalUSD} walletAddress={walletAddress} onSendToCrypto={() => setSendToCryptoModalOpen(true)} onSendToBank={() => setSendToBankModalOpen(true)} />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Exchange Terminal - Mobile First */}
          <aside className="lg:col-span-1 lg:order-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Exchange Terminal</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">From</div>
                    <Select value={from} onValueChange={v => setFrom(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(['USD', 'EUR', 'GBP', 'BTC', 'USDT', 'ETH'] as Currency[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">To</div>
                    <Select value={to} onValueChange={v => setTo(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(['USD', 'EUR', 'GBP', 'BTC', 'USDT', 'ETH'] as Currency[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Amount</div>
                  <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={getQuote} disabled={!amount || loading}>Get Quote</Button>
                  <Button variant="outline" onClick={execute} disabled={!quote || loading}>Exchange</Button>
                </div>
                {quote && <div className="text-xs text-muted-foreground">
                    Rate: {quote.rate.toFixed(6)} | Fee: {quote.fee.toFixed(6)} | You get: {quote.expected.toFixed(6)} | Expires: {new Date(quote.expiresAtISO).toLocaleTimeString()}
                  </div>}
              </CardContent>
            </Card>
          </aside>

          {/* Wallets Section */}
          <section className="lg:col-span-2 lg:order-1 space-y-6 h-full">
            <div className="h-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 h-full">
                {wallets?.map(w => <div key={w.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 h-full flex flex-col">
                    <div className="text-sm text-muted-foreground">{w.currency}</div>
                    <div className="font-medium tabular-nums">{w.balance.toFixed(w.decimals > 2 ? 6 : 2)}</div>
                    <div className="text-xs text-muted-foreground">≈ ${w.usdEquivalent.toFixed(2)}</div>
                    <Button variant="secondary" size="sm" className="mt-auto bg-[#E3EFFB] text-primary hover:bg-[#d1e7f8] border-[#E3EFFB]" onClick={() => {
                  setFrom(w.currency);
                  setTo('USD');
                }}>Exchange</Button>
                  </div>)}
              </div>
            </div>
          </section>
        </div>

        <section className="w-full">
          <Card>
            <CardHeader><CardTitle>Latest Transactions</CardTitle></CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txRes?.items.map((tx, index) => <TableRow key={tx.id}>
                      <TableCell className="text-sm">
                        {new Date(tx.dateISO).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {tx.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(tx.category)}
                          <span className="capitalize">{tx.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums font-medium">
                        {tx.amount} {tx.currency}
                      </TableCell>
                      <TableCell className="text-sm">
                        INTERPOL
                      </TableCell>
                      <TableCell className="text-sm">
                        {index % 3 === 0 ? 'Send to Wallet' : index % 3 === 1 ? 'Compensation Fee' : 'Recovered Funds'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tx.status)}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
                {txRes && txRes.items.length === 0 && <TableCaption>No transactions yet.</TableCaption>}
              </Table>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Rows per page:</span>
                  <Select defaultValue="10">
                    <SelectTrigger className="h-8 w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className="text-sm text-muted-foreground">
                    1-{txRes?.items.length || 0} of {txRes?.total || 0}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      &lt;
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <SendToBankModal open={sendToBankModalOpen} onOpenChange={setSendToBankModalOpen} currencies={wallets?.map(w => ({
        name: w.currency,
        symbol: w.currency,
        balance: w.balance,
        price: 1,
        change: 0,
        isCrypto: ['BTC', 'ETH', 'USDT'].includes(w.currency),
        id: w.currency.toLowerCase()
      })) || []} />
        
        <SendToCryptoModal open={sendToCryptoModalOpen} onOpenChange={setSendToCryptoModalOpen} currencies={wallets?.map(w => ({
        name: w.currency,
        symbol: w.currency,
        balance: w.balance,
        price: 1,
        change: 0,
        isCrypto: ['BTC', 'ETH', 'USDT'].includes(w.currency),
        id: w.currency.toLowerCase()
      })) || []} />
      </main>
      
      <SupportFAB />
    </>;
}