import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import reportWebVitals from './reportWebVitals.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { BrowserRouter as Router } from 'react-router-dom';

import { kartozaTheme } from './theme/Theme';
import AppRoutes from './routes.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';

import { store } from './redux/store';
import { Provider } from 'react-redux';

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
              <AppRoutes />
            </Router>
          </React.StrictMode>
        </Provider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

reportWebVitals();
