import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installModalScrollGuard } from './services/modalScrollGuard';
import { installAuthFetch } from './services/authClient';

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event?.reason?.message || event?.reason || '');
    if (
      !reasonStr ||
      reasonStr.includes('WebSocket') ||
      reasonStr.includes('vite') ||
      reasonStr.includes('Failed to fetch') ||
      reasonStr.includes('NetworkError')
    ) {
      event.preventDefault();
    }
  });

  try {
    const rawAlert = window.alert;
    window.alert = (msg?: unknown) => {
      try {
        if (window.self === window.top && rawAlert) {
          rawAlert.call(window, String(msg ?? ''));
        } else {
          console.info('[Aviso]:', msg);
        }
      } catch {
        console.info('[Aviso]:', msg);
      }
    };
  } catch {}

  try {
    const rawConfirm = window.confirm;
    window.confirm = (msg?: string) => {
      try {
        if (window.self === window.top && rawConfirm) {
          return rawConfirm.call(window, msg);
        }
        return true;
      } catch {
        return true;
      }
    };
  } catch {}

  try {
    const rawPrompt = window.prompt;
    window.prompt = (msg?: string, defVal?: string) => {
      try {
        if (window.self === window.top && rawPrompt) {
          return rawPrompt.call(window, msg, defVal);
        }
        return defVal || '';
      } catch {
        return defVal || '';
      }
    };
  } catch {}
}

installModalScrollGuard();
installAuthFetch();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
