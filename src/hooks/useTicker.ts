import { useEffect, useState } from 'react';
import type { Currency } from '@/types/models';

type Ticker = {
  price: number | null;
  high24h: number | null;
  low24h: number | null;
  change24hPct: number | null;
  source: 'binance' | 'coinbase' | 'none';
  loading: boolean;
  error: string | null;
};

const cryptoSet = new Set<Currency>(['BTC', 'ETH', 'USDT']);
const fiatSet = new Set<Currency>(['USD', 'EUR', 'GBP']);

async function fetchBinanceTicker(base: Currency, quote: Currency, signal: AbortSignal) {
  // Try direct symbol first
  const tryFetch = async (symbol: string) => {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { signal });
    if (!res.ok) return null;
    const d = await res.json();
    // Ensure required fields exist
    if (!('lastPrice' in d)) return null;
    return d as any;
  };

  let invert = false;
  let data = await tryFetch(`${base}${quote}`);
  if (!data) {
    // Try reversed
    const rev = await tryFetch(`${quote}${base}`);
    if (!rev) return { price: null, high24h: null, low24h: null, change24hPct: null };
    data = rev;
    invert = true;
  }

  const open = parseFloat(data.openPrice);
  const last = parseFloat(data.lastPrice);
  const high = parseFloat(data.highPrice);
  const low = parseFloat(data.lowPrice);

  if (invert) {
    const price = 1 / last;
    const highInv = 1 / low;
    const lowInv = 1 / high;
    const openInv = 1 / open;
    const changePct = ((price - openInv) / openInv) * 100;
    return { price, high24h: highInv, low24h: lowInv, change24hPct: changePct };
  }

  const changePct = ((last - open) / open) * 100;
  return { price: last, high24h: high, low24h: low, change24hPct: changePct };
}

async function fetchCoinbaseStats(base: Currency, quote: Currency, signal: AbortSignal) {
  // Fetch stats for base-quote; if unavailable, try reversed and invert precisely
  const tryFetch = async (b: Currency, q: Currency) => {
    const product = `${b}-${q}`;
    const res = await fetch(`https://api.exchange.coinbase.com/products/${product}/stats`, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const d = await res.json();
    if (!('last' in d)) return null;
    return d as any;
  };

  let invert = false;
  let data = await tryFetch(base, quote);
  if (!data) {
    const rev = await tryFetch(quote, base);
    if (!rev) return { price: null, high24h: null, low24h: null, change24hPct: null };
    data = rev;
    invert = true;
  }

  const last = parseFloat(data.last);
  const high = parseFloat(data.high);
  const low = parseFloat(data.low);
  const open = parseFloat(data.open);

  if (invert) {
    const price = 1 / last;
    const highInv = 1 / low;
    const lowInv = 1 / high;
    const openInv = 1 / open;
    const changePct = ((price - openInv) / openInv) * 100;
    return { price, high24h: highInv, low24h: lowInv, change24hPct: changePct };
  }

  const changePct = ((last - open) / open) * 100;
  return { price: last, high24h: high, low24h: low, change24hPct: changePct };
}

export default function useTicker(base: Currency, quote: Currency): Ticker {
  const [state, setState] = useState<Ticker>({
    price: null,
    high24h: null,
    low24h: null,
    change24hPct: null,
    source: 'none',
    loading: false,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function load() {
      if (base === quote) {
        setState((s) => ({ ...s, loading: false, source: 'none', price: null, high24h: null, low24h: null, change24hPct: null }));
        return;
      }
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        let data: { price: number | null; high24h: number | null; low24h: number | null; change24hPct: number | null } | null = null;
        let source: Ticker['source'] = 'none';

        if (cryptoSet.has(base) && cryptoSet.has(quote)) {
          data = await fetchBinanceTicker(base, quote, signal);
          source = 'binance';
        } else if (cryptoSet.has(base) && fiatSet.has(quote)) {
          data = await fetchCoinbaseStats(base, quote, signal);
          source = 'coinbase';
        } else if (fiatSet.has(base) && cryptoSet.has(quote)) {
          // Invert via coinbase by fetching quote-base
          data = await fetchCoinbaseStats(quote as Currency, base as Currency, signal);
          source = 'coinbase';
        } else {
          // Unsupported (fiat/fiat) for now
          data = { price: null, high24h: null, low24h: null, change24hPct: null };
          source = 'none';
        }

        if (signal.aborted) return;
        setState({
          price: data?.price ?? null,
          high24h: data?.high24h ?? null,
          low24h: data?.low24h ?? null,
          change24hPct: data?.change24hPct ?? null,
          source,
          loading: false,
          error: null,
        });
      } catch (e: any) {
        if (signal.aborted) return;
        setState((s) => ({ ...s, loading: false, error: e?.message || 'Failed to load ticker' }));
      }
    }

    load();
    return () => controller.abort();
  }, [base, quote]);

  return state;
}
