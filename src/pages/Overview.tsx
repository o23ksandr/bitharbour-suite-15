import SupportFAB from '@/components/SupportFAB';
import SEO from '@/components/SEO';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Copy, QrCode, MoreVertical } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Wallet } from '@/types/models';
import MarketHeader from '@/components/MarketHeader';
import SendToBankModal from '@/components/SendToBankModal';
import SendToCryptoModal from '@/components/SendToCryptoModal';
import UserProfileHeader from '@/components/UserProfileHeader';
import type { Currency } from '@/types/models';

// Import currency logos
import usdLogo from '@/assets/usd-logo.png';
import euroLogo from '@/assets/euro-logo.png';
import gbpLogo from '@/assets/gbp-logo.png';

async function fetchJSON<T>(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return (await res.json()) as T;
}
interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}
export default function Overview() {
  const {
    user
  } = useAuth();
  const [sendToBankModalOpen, setSendToBankModalOpen] = useState(false);
  const [sendToCryptoModalOpen, setSendToCryptoModalOpen] = useState(false);
  const [coinsData, setCoinsData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch wallet data from API
  const {
    data: wallets
  } = useQuery<Wallet[]>({
    queryKey: ['wallets'],
    queryFn: () => fetchJSON('/api/wallets')
  });
  
  const name = user?.fullName || 'Benjamin Dawson';
  const accountId = user?.accountId || '284921';
  const status = user?.status || 'Activated';
  const walletAddress = '34x6gZBQCJqkfNVvDru68EvTZNaRm3FTB2';
  const balance = wallets?.reduce((s, w) => s + w.usdEquivalent, 0) ?? 0;

  // Pair selection for MarketHeader
  const [base, setBase] = useState<Currency>('BTC');
  const [quote, setQuote] = useState<Currency>('USDT');
  const onPairChange = (b: Currency, q: Currency) => {
    setBase(b);
    setQuote(q);
  };

  // Define currencies in specific order with balances
  const currencies = [{
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: 0.24891,
    price: 121258,
    change: 1.09,
    isCrypto: true,
    id: 'bitcoin'
  }, {
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 3.542,
    price: 4676.15,
    change: 4.39,
    isCrypto: true,
    id: 'ethereum'
  }, {
    name: 'Tether',
    symbol: 'USDT',
    balance: 12450.00,
    price: 0.999996,
    change: 0.003,
    isCrypto: true,
    id: 'tether'
  }, {
    name: 'US Dollar',
    symbol: 'USD',
    balance: 5500.00,
    price: 1.00,
    change: 0,
    isCrypto: false,
    id: 'usd'
  }, {
    name: 'Euro',
    symbol: 'EUR',
    balance: 2300.00,
    price: 1.10,
    change: -0.12,
    isCrypto: false,
    id: 'euro'
  }, {
    name: 'Great Britain Pound',
    symbol: 'GBP',
    balance: 1850.00,
    price: 1.25,
    change: 0.08,
    isCrypto: false,
    id: 'gbp'
  }];

  // Fetch real crypto data for prices
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether&order=market_cap_desc&per_page=3&page=1&sparkline=false');
        const data = await response.json();
        setCoinsData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoData();
  }, []);
  
  const getFiatCurrencyLogo = (symbol: string): string => {
    switch (symbol) {
      case "USD": return usdLogo;
      case "EUR": return euroLogo;
      case "GBP": return gbpLogo;
      default: return "";
    }
  };
  
  return <>
      <SEO title="Overview | BITHARBOUR" description="Crypto overview with market stats, TradingView chart, and top assets." />
      <HeaderBar />
      <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 grid gap-6 grid-cols-1">
        <section className="space-y-6">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground">Welcome back to your portfolio</p>
          </header>

          <UserProfileHeader
            name={name}
            accountId={accountId}
            status={status}
            balance={balance}
            walletAddress={walletAddress}
            onSendToCrypto={() => setSendToCryptoModalOpen(true)}
            onSendToBank={() => setSendToBankModalOpen(true)}
          />

          

          <MarketHeader base={base} quote={quote} onChange={onPairChange} />

          <Card>
            <CardHeader>
              <CardTitle>Your currencies</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Your Balance</TableHead>
                    <TableHead>24h Change</TableHead>
                    <TableHead>Market Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencies.map((currency, index) => {
                  // Get real data for crypto currencies
                  const coinData = coinsData.find(coin => coin.id === currency.id);
                  const currentPrice = coinData ? coinData.current_price : currency.price;
                  const priceChange = coinData ? coinData.price_change_percentage_24h : currency.change;
                  return <TableRow key={currency.symbol}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {currency.isCrypto ? (
                                <AvatarImage 
                                  src={coinData ? `https://coin-images.coingecko.com/coins/images/${coinData.id === 'bitcoin' ? '1' : coinData.id === 'ethereum' ? '279' : '325'}/small/${coinData.id}.png` : ''} 
                                  alt={`${currency.name} logo`} 
                                />
                              ) : (
                                <AvatarImage 
                                  src={getFiatCurrencyLogo(currency.symbol)} 
                                  alt={`${currency.name} logo`} 
                                />
                              )}
                              <AvatarFallback className="text-xs">{currency.symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{currency.name}</div>
                              <div className="text-xs text-muted-foreground">{currency.symbol.toUpperCase()}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {currency.balance.toLocaleString('en-US', {
                            minimumFractionDigits: currency.isCrypto ? 2 : 2,
                            maximumFractionDigits: currency.isCrypto ? 5 : 2
                          })} {currency.symbol}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${(currency.balance * currentPrice).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={priceChange < 0 ? 'text-destructive' : 'text-emerald-500'}>
                          {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          ${currentPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: currentPrice < 1 ? 6 : 2
                      })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" aria-label="More actions">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>;
                })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <SendToBankModal 
          open={sendToBankModalOpen} 
          onOpenChange={setSendToBankModalOpen}
          currencies={currencies}
        />
        
        <SendToCryptoModal 
          open={sendToCryptoModalOpen} 
          onOpenChange={setSendToCryptoModalOpen}
          currencies={currencies}
        />
      </main>
      
      <SupportFAB />
    </>;
}