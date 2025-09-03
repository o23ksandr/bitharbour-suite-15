import { http, HttpResponse, delay } from 'msw';
import type { ExchangeQuote, Transaction, User, Wallet, Currency } from '@/types/models';

let token: string | null = null;

const user: User = {
  id: 'u_001',
  fullName: 'Alex Morgan',
  accountId: 'BH-482913',
  status: 'Activated',
  kycStatus: 'Verified',
  email: 'alex.morgan@example.com',
  dob: '1990-05-20',
  address: { street: '123 Harbor St', country: 'US', city: 'Miami', postalCode: '33101' },
  preferences: { language: 'en', notifications: true, showToolsFullScreen: false },
};

let wallets: Wallet[] = [
  { id: 'w_usd', currency: 'USD', balance: 5234.12, usdEquivalent: 5234.12, decimals: 2 },
  { id: 'w_eur', currency: 'EUR', balance: 2310.5, usdEquivalent: 2310.5 * 1.08, decimals: 2 },
  { id: 'w_gbp', currency: 'GBP', balance: 1120.85, usdEquivalent: 1120.85 * 1.27, decimals: 2 },
  { id: 'w_btc', currency: 'BTC', balance: 0.2456789, usdEquivalent: 0.2456789 * 62000, decimals: 8, address: 'bc1qh9m2v0u6xq7y8z9abc1234567890xyz' },
  { id: 'w_usdt', currency: 'USDT', balance: 1500, usdEquivalent: 1500, decimals: 2 },
  { id: 'w_eth', currency: 'ETH', balance: 3.412, usdEquivalent: 3.412 * 3200, decimals: 8 },
];

let transactions: Transaction[] = [
  { id: 'tx_1001', dateISO: new Date(Date.now() - 86400000 * 1).toISOString(), category: 'Deposit', amount: 1500, currency: 'USD', entity: 'Bank Transfer', purpose: 'Top-up', status: 'Approved' },
  { id: 'tx_1002', dateISO: new Date(Date.now() - 86400000 * 2).toISOString(), category: 'Send', amount: -0.05, currency: 'BTC', entity: '1A1zP1...', purpose: 'Payment', status: 'Approved' },
  { id: 'tx_1003', dateISO: new Date(Date.now() - 86400000 * 3).toISOString(), category: 'Exchange', amount: -500, currency: 'USD', entity: 'Exchange', purpose: 'Swap to USDT', status: 'Approved' },
];

const quotes = new Map<string, ExchangeQuote>();

function fakeRate(from: Currency, to: Currency): number {
  const table: Record<Currency, Record<Currency, number>> = {
    USD: { USD: 1, EUR: 0.92, GBP: 0.79, BTC: 1 / 62000, USDT: 1, ETH: 1 / 3200 },
    EUR: { USD: 1.08, EUR: 1, GBP: 0.86, BTC: 1 / 57000, USDT: 1.08, ETH: 1.08 / 3200 },
    GBP: { USD: 1.27, EUR: 1.16, GBP: 1, BTC: 1 / 50000, USDT: 1.27, ETH: 1.27 / 3200 },
    BTC: { USD: 62000, EUR: 57000, GBP: 50000, BTC: 1, USDT: 62000, ETH: 18 },
    USDT: { USD: 1, EUR: 0.92, GBP: 0.79, BTC: 1 / 62000, USDT: 1, ETH: 1 / 3200 },
    ETH: { USD: 3200, EUR: 2950, GBP: 2500, BTC: 1 / 18, USDT: 3200, ETH: 1 },
  };
  return table[from][to];
}

function paginate<T>(arr: T[], page: number, size: number) {
  const start = (page - 1) * size;
  return arr.slice(start, start + size);
}

export const handlers = [
  http.post('/api/signin', async ({ request }) => {
    const body = await request.json().catch(() => ({} as any));
    await delay(400);
    if (body?.username === 'demo' && body?.password === 'demo123') {
      token = 'mock-token';
      return HttpResponse.json({ success: true, token });
    }
    return new HttpResponse(JSON.stringify({ success: false, message: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }),

  http.get('/api/me', async () => {
    await delay(200);
    if (!token) return new HttpResponse('Unauthorized', { status: 401 });
    return HttpResponse.json(user);
  }),

  http.get('/api/wallets', async () => {
    await delay(300);
    if (!token) return new HttpResponse('Unauthorized', { status: 401 });
    return HttpResponse.json(wallets);
  }),

  http.get('/api/transactions', async ({ request }) => {
    await delay(300);
    if (!token) return new HttpResponse('Unauthorized', { status: 401 });
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const size = Number(url.searchParams.get('size') || '10');
    const sort = url.searchParams.get('sort') || 'date:desc';
    let data = [...transactions];
    if (sort.startsWith('date')) {
      const dir = sort.split(':')[1] || 'desc';
      data.sort((a, b) => (dir === 'asc' ? a.dateISO.localeCompare(b.dateISO) : b.dateISO.localeCompare(a.dateISO)));
    }
    return HttpResponse.json({ items: paginate(data, page, size), total: data.length });
  }),

  http.post('/api/exchange/quote', async ({ request }) => {
    await delay(400);
    if (!token) return new HttpResponse('Unauthorized', { status: 401 });
    const body = (await request.json()) as { from: any; to: any; amount: number };
    const from = body.from as Currency; const to = body.to as Currency; const amount = Number(body.amount);
    if (!from || !to || !amount || amount <= 0) {
      return new HttpResponse(JSON.stringify({ message: 'Invalid input' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const rate = fakeRate(from, to);
    const fee = Math.max(0.0001, amount * 0.002);
    const expected = amount * rate - (from === 'BTC' || from === 'ETH' ? fee * rate : fee);
    const id = `q_${Date.now()}`;
    const expiresAtISO = new Date(Date.now() + 30_000).toISOString();
    const quote: ExchangeQuote = { id, from, to, amount, rate, fee, expected, expiresAtISO };
    quotes.set(id, quote);
    return HttpResponse.json(quote);
  }),

  http.post('/api/exchange/execute', async ({ request }) => {
    await delay(500);
    if (!token) return new HttpResponse('Unauthorized', { status: 401 });
    const body = (await request.json()) as { quoteId: string };
    const quote = quotes.get(body.quoteId);
    if (!quote) return new HttpResponse('Quote not found', { status: 404 });
    const fromWallet = wallets.find(w => w.currency === quote.from)!;
    const toWallet = wallets.find(w => w.currency === quote.to)!;
    const cost = quote.amount + (quote.from === 'BTC' || quote.from === 'ETH' ? quote.fee : quote.fee);
    if (fromWallet.balance < cost) {
      return new HttpResponse(JSON.stringify({ success: false, message: 'Insufficient balance' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    fromWallet.balance -= cost;
    toWallet.balance += quote.expected;
    // recompute usdEquivalent roughly
    wallets = wallets.map(w => ({ ...w, usdEquivalent: w.currency === 'USD' || w.currency === 'USDT' ? w.balance : (w.currency === 'BTC' ? w.balance * 62000 : w.currency === 'ETH' ? w.balance * 3200 : w.balance * (w.currency === 'EUR' ? 1.08 : 1.27)) }));
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      dateISO: new Date().toISOString(),
      category: 'Exchange',
      amount: -quote.amount,
      currency: quote.from,
      entity: 'Exchange',
      purpose: `${quote.from} → ${quote.to}`,
      status: 'Approved',
    };
    transactions.unshift(tx);
    return HttpResponse.json({ success: true, tx });
  }),

  http.post('/api/kyc/upload', async ({ request }) => {
    await delay(700);
    if (!token) return new HttpResponse('Unauthorized', { status: 401 });
    // Simulate processing
    return HttpResponse.json({ success: true, kycStatus: 'Submitted' });
  }),

  http.post('/api/activate/initiate', async () => {
    await delay(400);
    if (!token) return new HttpResponse('Unauthorized', { status: 401 });
    const address = wallets.find(w => w.currency === 'BTC')?.address || 'bc1q-demo-address';
    const qrPngDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="white"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">QR DEMO</text></svg>`);
    return HttpResponse.json({ success: true, address, qrPngDataUrl });
  }),
];
