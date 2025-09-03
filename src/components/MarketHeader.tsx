import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Currency } from "@/types/models";
import useTicker from "@/hooks/useTicker";

// Import currency logos
import bitcoinLogo from "@/assets/bitcoin-logo.png";
import ethereumLogo from "@/assets/ethereum-logo.png";
import tetherLogo from "@/assets/tether-logo.png";
import usdLogo from "@/assets/usd-logo.png";
import euroLogo from "@/assets/euro-logo.png";
import gbpLogo from "@/assets/gbp-logo.png";

const currencies: Currency[] = ["BTC", "USDT", "ETH", "USD", "EUR", "GBP"];

const getCurrencyLogo = (currency: Currency): string => {
  switch (currency) {
    case "BTC": return bitcoinLogo;
    case "ETH": return ethereumLogo;
    case "USDT": return tetherLogo;
    case "USD": return usdLogo;
    case "EUR": return euroLogo;
    case "GBP": return gbpLogo;
    default: return "";
  }
};

type Props = {
  base: Currency;
  quote: Currency;
  onChange: (base: Currency, quote: Currency) => void;
};

export default function MarketHeader({ base, quote, onChange }: Props) {
  const isFiat = (x: string) => ["USD", "EUR", "GBP"].includes(x);
  
  const handleBase = (val: string) => {
    if (val === quote) return;
    // Prevent selecting two fiat currencies
    if (isFiat(val) && isFiat(quote)) return;
    onChange(val as Currency, quote);
  };
  const handleQuote = (val: string) => {
    if (val === base) return;
    // Prevent selecting two fiat currencies
    if (isFiat(base) && isFiat(val)) return;
    onChange(base, val as Currency);
  };
  const swap = () => {
    // Prevent swapping if both would be fiat
    if (isFiat(quote) && isFiat(base)) return;
    onChange(quote, base);
  };

  const { price, high24h, low24h, change24hPct } = useTicker(base, quote);
  const fmt = (v: number | null) => {
    if (v == null || Number.isNaN(v)) return "—";
    return isFiat(quote)
      ? v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Number(v).toFixed(6).replace(/\.?0+$/, "");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Mobile-optimized header section */}
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-2">
        {/* Currency pair and price - primary info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                    <Avatar className="h-8 w-8 md:h-8 md:w-8 cursor-pointer">
                      <AvatarImage src={getCurrencyLogo(base)} alt={base} />
                      <AvatarFallback className="text-xs">{base}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {currencies.filter((c) => c !== quote && !(isFiat(c) && isFiat(quote))).map((c) => (
                    <DropdownMenuItem key={c} onClick={() => handleBase(c)} className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={getCurrencyLogo(c)} alt={c} />
                        <AvatarFallback className="text-xs">{c}</AvatarFallback>
                      </Avatar>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                    <Avatar className="h-8 w-8 md:h-8 md:w-8 cursor-pointer">
                      <AvatarImage src={getCurrencyLogo(quote)} alt={quote} />
                      <AvatarFallback className="text-xs">{quote}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {currencies.filter((c) => c !== base && !(isFiat(base) && isFiat(c))).map((c) => (
                    <DropdownMenuItem key={c} onClick={() => handleQuote(c)} className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={getCurrencyLogo(c)} alt={c} />
                        <AvatarFallback className="text-xs">{c}</AvatarFallback>
                      </Avatar>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-base md:text-lg font-semibold tracking-tight">
              {base} / {quote}
            </div>
            <Button variant="ghost" size="icon" aria-label="Swap base and quote" onClick={swap} className="h-7 w-7 md:h-10 md:w-10">
              <ArrowLeftRight className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
          {/* Price displayed prominently on mobile */}
          <div className="text-lg md:hidden font-bold">{fmt(price)}</div>
        </div>
      </div>

      {/* Mobile-optimized stats section */}
      <div className="grid grid-cols-3 md:auto-cols-max md:grid-flow-col gap-4 md:gap-4 items-end">
        <div className="flex flex-col items-center md:items-start">
          <div className="text-xs md:text-xs text-muted-foreground text-center md:text-left">24h Change</div>
          <div className={["text-sm md:text-sm font-medium text-center md:text-left", change24hPct == null ? "text-muted-foreground" : change24hPct >= 0 ? "text-emerald-500" : "text-destructive"].join(" ")}>
            {change24hPct == null ? "—" : `${change24hPct.toFixed(2)}%`}
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <div className="text-xs md:text-xs text-muted-foreground text-center md:text-left">24h High</div>
          <div className="text-sm md:text-sm font-semibold text-center md:text-left">{fmt(high24h)}</div>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <div className="text-xs md:text-xs text-muted-foreground text-center md:text-left">24h Low</div>
          <div className="text-sm md:text-sm font-semibold text-center md:text-left">{fmt(low24h)}</div>
        </div>
        {/* Price shown on desktop only since it's already displayed prominently on mobile */}
        <div className="hidden md:block text-xl md:text-2xl font-bold">{fmt(price)}</div>
      </div>
    </div>
  );
}
