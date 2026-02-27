import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { Layout } from './components/Layout';
import MarketLobby from './pages/MarketLobby';
import BetPlacement from './pages/BetPlacement';
import MyBets from './pages/MyBets';
import Wallet from './pages/Wallet';
import AdminPanel from './pages/AdminPanel';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useInternetIdentity } from './hooks/useInternetIdentity';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MarketLobby,
});

const betRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bet/$marketId',
  component: BetPlacement,
});

const myBetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-bets',
  component: MyBets,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: Wallet,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  betRoute,
  myBetsRoute,
  walletRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProfileSetupGate() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !isLoading && isFetched && userProfile === null;

  return <ProfileSetupModal open={showProfileSetup} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <RouterProvider router={router} />
          <ProfileSetupGate />
          <Toaster richColors position="top-right" />
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
