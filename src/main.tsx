import './utils/safeStorage';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Helper to detect benign platform/environment noise that should not trigger alerts
function isBenignError(msgOrReason: string | undefined | null): boolean {
  if (!msgOrReason) return false;
  const str = String(msgOrReason).toLowerCase();
  return (
    str.includes('websocket') ||
    str.includes('closed without opened') ||
    str.includes('failed to connect to websocket') ||
    str.includes('resizeobserver loop') ||
    str.includes('script error') ||
    str.includes('aborted') ||
    str.includes('canceling') ||
    str.includes('canceled')
  );
}

// Global error handlers to prevent unhandled runtime errors from freezing the UI
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (isBenignError(event.message)) {
      return;
    }
    console.warn('[Global Safety Interceptor] Runtime error safely handled:', event.message);
    try {
      fetch('/api/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'main_window_error',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error ? event.error.stack : null,
        }),
      }).catch(() => {});
    } catch {}
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason
      ? (event.reason.message || event.reason.stack || String(event.reason))
      : 'unknown';

    if (isBenignError(reasonStr)) {
      return;
    }

    console.warn('[Global Safety Interceptor] Unhandled promise rejection safely handled:', event.reason);
    try {
      fetch('/api/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'main_unhandled_rejection',
          reason: reasonStr,
        }),
      }).catch(() => {});
    } catch {}
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary fallbackTitle="Isekai Worlds Auto-Recovery Active">
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
    console.log('[Isekai Engine] Root rendered successfully.');
  } catch (mountErr: any) {
    console.error('[Isekai Engine] Critical root mount error:', mountErr);
    try {
      fetch('/api/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'critical_mount_error',
          message: mountErr?.message,
          stack: mountErr?.stack,
        }),
      }).catch(() => {});
    } catch {}

    rootElement.innerHTML = `
      <div style="min-height: 100vh; background-color: #020617; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px;">
        <div style="width: 56px; height: 56px; border-radius: 18px; background: linear-gradient(135deg, #9333ea, #ec4899); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(147, 51, 234, 0.4); margin-bottom: 20px;">
          <span style="font-size: 28px;">⚡</span>
        </div>
        <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.025em; margin-bottom: 8px;">
          ISEKAI WORLDS • REALM RECOVERY
        </div>
        <div style="font-size: 13px; font-family: monospace; color: #f43f5e; margin-bottom: 20px; max-width: 480px;">
          ${mountErr?.message || 'Recovering realm engine state...'}
        </div>
        <button onclick="window.location.reload()" style="padding: 12px 24px; border-radius: 14px; background: linear-gradient(135deg, #9333ea, #ec4899); color: #fff; font-weight: bold; border: none; cursor: pointer; font-size: 14px; box-shadow: 0 4px 20px rgba(147, 51, 234, 0.5);">
          ENTER REALM
        </button>
      </div>
    `;
  }
}

