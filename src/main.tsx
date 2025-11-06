import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

import { kartozaTheme } from './theme/Theme.tsx';
import Navbar from './components/NavBar/NavBar.tsx';
import AppRoutes from './routes';

import './styles.scss';

declare global {
  interface Window {
    sentryDsn?: string;
  }
}

Sentry.init({
  dsn: window.sentryDsn,
  tunnel: '/sentry-proxy/',
  tracesSampleRate: 0.5,
});

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);
root.render(
  <ErrorBoundary>
    <ChakraProvider value={kartozaTheme}>
      <React.StrictMode>
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </React.StrictMode>
    </ChakraProvider>
  </ErrorBoundary>
);

reportWebVitals();
