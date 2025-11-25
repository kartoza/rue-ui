import * as Sentry from '@sentry/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import AppRoutes from './routes.tsx';
import { store } from './redux/store';

import reportWebVitals from './reportWebVitals.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from './components/Toaster';

import { kartozaTheme } from './theme/Theme';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';

Sentry.init({
  dsn: (window as { sentryDsn?: string }).sentryDsn,
  tunnel: '/sentry-proxy/',
  tracesSampleRate: 0.5,
});

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <ChakraProvider value={kartozaTheme}>
        <Provider store={store}>
          <React.StrictMode>
            <Router>
              <Toaster />
              <AppRoutes />
            </Router>
          </React.StrictMode>
        </Provider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

reportWebVitals();
