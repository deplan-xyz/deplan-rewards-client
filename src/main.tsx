import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

import router from './config/router';
import Web3ModalProvider from './providers/web3modal';
import ConnectDeplanAppDialog from './components/ConnectDeplanAppDialog';
import { ElegibilityProvider } from './hooks/useEligibility';
import './index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider />
    <Web3ModalProvider>
      <QueryClientProvider client={queryClient}>
        <ElegibilityProvider>
          <RouterProvider router={router} />
        </ElegibilityProvider>
        <ConnectDeplanAppDialog />
      </QueryClientProvider>
    </Web3ModalProvider>
  </React.StrictMode>
);
