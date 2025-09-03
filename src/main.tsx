import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

async function start() {
  // Start MSW for mocked API endpoints
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
  createRoot(document.getElementById("root")!).render(<App />);
}

start().catch((e) => {
  console.error('Failed to start app', e);
  createRoot(document.getElementById("root")!).render(<App />);
});
