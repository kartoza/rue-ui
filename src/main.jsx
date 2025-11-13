import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

import { system } from './theme/Theme.jsx';
import AppRoutes from './routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';

import { store } from './app/store.js';
import { Provider } from 'react-redux';

Sentry.init({
  dsn: window.sentryDsn,
  tunnel: '/sentry-proxy/',
  tracesSampleRate: 0.5,
});

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <ChakraProvider value={system}>
        <Provider store={store}>
          <React.StrictMode>
            <Router>
              <AppRoutes />
            </Router>
          </React.StrictMode>
        </Provider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

reportWebVitals();
