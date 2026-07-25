import { StrictMode,Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { SmartNPCGenerator } from './SmartNPCGenerator';
import { ErrorBoundary } from './SmartNPCGenerator/components/ErrorBoundary';
import './SmartNPCGenerator/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary><Suspense fallback={<main className="app-loading" aria-live="polite"><div className="skeleton tall"/><p>Loading Smart NPC Studio…</p></main>}><SmartNPCGenerator /></Suspense></ErrorBoundary>
  </StrictMode>,
);
