export type User = {
  id: string;
  fullName: string;
  accountId: string;
  status: 'Activated' | 'Pending';
  kycStatus: 'Unverified' | 'Submitted' | 'Verified' | 'Rejected';
  email: string;
  dob?: string; // ISO date
  address: {
    street: string;
    country: string;
    city: string;
    postalCode: string;
  };
  preferences: {
    language: 'en' | 'es';
    notifications: boolean;
    showToolsFullScreen: boolean;
  };
};

export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'USDT' | 'ETH';

export type Wallet = {
  id: string;
  currency: Currency;
  balance: number;
  usdEquivalent: number; // cached USD value
  address?: string;
  decimals: number;
};

export type TransactionCategory = 'Deposit' | 'Send' | 'Exchange';
export type TransactionStatus = 'Approved' | 'Pending' | 'Denied';

export type Transaction = {
  id: string;
  dateISO: string;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  entity?: string;
  purpose?: string;
  status: TransactionStatus;
};

export type ExchangeQuote = {
  id: string;
  from: Currency;
  to: Currency;
  amount: number;
  rate: number;
  fee: number;
  expected: number;
  expiresAtISO: string;
};
