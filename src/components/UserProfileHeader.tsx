import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Copy, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface UserProfileHeaderProps {
  name: string;
  accountId: string;
  status: string;
  balance: number;
  walletAddress: string;
  onSendToCrypto?: () => void;
  onSendToBank?: () => void;
}

export default function UserProfileHeader({
  name,
  accountId,
  status,
  balance,
  walletAddress,
  onSendToCrypto,
  onSendToBank
}: UserProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <Card className="bg-transparent shadow-none border-0">
      <CardContent className="p-0">
        <TooltipProvider>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center pb-6">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar>
                <AvatarImage src="/lovable-uploads/1b21aba6-9682-4957-9b78-58748abc057a.png" alt={`${name} avatar`} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium truncate">{name}</div>
                  <Badge variant="secondary">{status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Account ID: {accountId}</div>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-12" />

            <div className="flex items-end gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Your Balance</div>
                <div className="text-[24px] font-semibold leading-tight">
                  ${balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
              {(onSendToCrypto || onSendToBank) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" aria-label="Send funds">Send</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background border z-50">
                    {onSendToCrypto && (
                      <DropdownMenuItem onClick={onSendToCrypto}>
                        Send to Crypto Wallet
                      </DropdownMenuItem>
                    )}
                    {onSendToBank && (
                      <DropdownMenuItem onClick={onSendToBank}>
                        Send to Bank
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-12" />

            <div className="flex items-end justify-between gap-3 min-w-0">
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground">Wallet Address (BTC)</div>
                <div className="truncate">{walletAddress}</div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Copy wallet address" onClick={handleCopy}>
                    <Copy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
              </Tooltip>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Show QR code">
                    <QrCode />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px]">
                  <DialogHeader className="text-center pb-4">
                    <DialogTitle className="text-xl font-semibold">Wallet Address (BTC)</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-2">Use this QR-code for adding funds to your wallet</p>
                  </DialogHeader>
                  
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(walletAddress)}&bgcolor=f8f9fa&color=000000`} 
                        alt="QR code for BTC wallet address" 
                        loading="lazy" 
                        className="rounded-lg border border-border"
                      />
                    </div>
                    
                    <div className="w-full">
                      <p className="text-sm text-muted-foreground mb-2">Wallet Address (BTC)</p>
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <p className="text-sm font-mono break-all flex-1">{walletAddress}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleCopy}
                          className="flex-shrink-0 h-8 w-8"
                          aria-label="Copy wallet address"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}