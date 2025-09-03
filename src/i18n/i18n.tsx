import React, { createContext, useContext, useMemo, useState } from 'react';

type Lang = 'en' | 'es';

type Dict = Record<string, string>;

const dicts: Record<Lang, Dict> = {
  en: {
    'app.name': 'BITHARBOUR',
    'signin.title': 'Sign in to BITHARBOUR',
    'signin.username': 'Username',
    'signin.password': 'Password',
    'signin.button': 'Sign In',
    'signin.forgot': 'Forgot password?',
    'dashboard.title': 'Dashboard',
    'wallets.title': 'Available Wallets',
    'exchange.title': 'Exchange Terminal',
    'transactions.title': 'Latest Transactions',
  },
  es: {
    'app.name': 'BITHARBOUR',
    'signin.title': 'Iniciar sesión en BITHARBOUR',
    'signin.username': 'Usuario',
    'signin.password': 'Contraseña',
    'signin.button': 'Acceder',
    'signin.forgot': '¿Olvidaste la contraseña?',
    'dashboard.title': 'Panel',
    'wallets.title': 'Carteras disponibles',
    'exchange.title': 'Terminal de intercambio',
    'transactions.title': 'Últimas transacciones',
  },
};

const I18nCtx = createContext<{ lang: Lang; t: (k: string) => string; setLang: (l: Lang) => void } | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');
  const t = useMemo(() => (k: string) => dicts[lang][k] ?? k, [lang]);
  return <I18nCtx.Provider value={{ lang, t, setLang }}>{children}</I18nCtx.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
