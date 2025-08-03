import '@/styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeContext/ThemeProvider';
import { store } from '@/redux/store';
import { AppRouter } from '@/router/AppRouter';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
