import SupportFAB from '@/components/SupportFAB';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';

export default function Activate() {
  const [data, setData] = useState<{ address: string; qrPngDataUrl: string } | null>(null);
  useEffect(() => {
    fetch('/api/activate/initiate', { method: 'POST' }).then(async (r) => {
      if (r.ok) setData(await r.json());
    });
  }, []);
  return (
    <main className="container mx-auto max-w-screen-md px-4 py-10">
      <SEO title="Activate | BITHARBOUR" description="Account activation instructions." />
      <h1 className="text-2xl font-semibold mb-4">Activate Account</h1>
      <p className="mb-6 text-sm text-muted-foreground">Activation reserve required (demo). No real funds processed.</p>
      {data && (
        <div className="rounded-md border p-4">
          <div className="text-sm mb-2">Send BTC to:</div>
          <div className="font-mono text-sm mb-4">{data.address}</div>
          <img src={data.qrPngDataUrl} alt="Activation QR code for BTC address" className="h-40 w-40" />
        </div>
      )}
      
      <SupportFAB />
    </main>
  );
}
