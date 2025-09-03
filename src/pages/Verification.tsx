import SupportFAB from '@/components/SupportFAB';
import SEO from '@/components/SEO';
import { useState } from 'react';

export default function Verification() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('Unverified');
  const [progress, setProgress] = useState<number>(0);

  async function upload() {
    if (!file) return;
    setProgress(30);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/kyc/upload', { method: 'POST', body: form });
    setProgress(100);
    if (res.ok) setStatus('Submitted');
  }

  return (
    <main className="container mx-auto max-w-screen-md px-4 py-10">
      <SEO title="Verification | BITHARBOUR" description="Submit documents for KYC verification." />
      <h1 className="text-2xl font-semibold mb-4">Verification</h1>
      <div className="rounded-md border p-4 space-y-3">
        <input type="file" accept="image/png,image/jpeg" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
        <button className="underline" onClick={upload} disabled={!file}>Send Request</button>
        <div className="text-sm text-muted-foreground">Status: {status}</div>
        {progress > 0 && <div className="h-2 bg-muted rounded"><div className="h-2 bg-primary rounded" style={{ width: `${progress}%` }} /></div>}
      </div>
      
      <SupportFAB />
    </main>
  );
}
