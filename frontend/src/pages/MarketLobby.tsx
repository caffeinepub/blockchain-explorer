import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllMarkets } from '../hooks/useMarketQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useGetGameResults, getLatestResultForMarket } from '../hooks/useGameResultsQueries';
import MarketCard from '../components/MarketCard';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mergeMarkets, STATIC_MARKETS } from '../lib/staticMarkets';

export default function MarketLobby() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: backendMarkets, isLoading, error, refetch } = useGetAllMarkets();
  const { data: userProfile } = useGetCallerUserProfile();

  // Always show all four standard Matka games; merge with backend data if available
  const markets = mergeMarkets(backendMarkets ?? []);

  // Collect all market names to fetch results for
  const allMarketNames = markets.map((m) => m.name);
  const staticMarketNames = STATIC_MARKETS.map((m) => m.name);
  const marketNamesToFetch = allMarketNames.length > 0 ? allMarketNames : staticMarketNames;

  const { data: gameResults } = useGetGameResults(marketNamesToFetch);

  const handleMarketClick = (marketId: bigint) => {
    if (!isAuthenticated) return;
    navigate({ to: '/bet/$marketId', params: { marketId: marketId.toString() } });
  };

  return (
    <div className="flex-1">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/matka-hero-banner.dim_1200x400.png"
          alt="Matka Pro"
          className="w-full h-40 sm:h-56 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-matka text-3xl sm:text-5xl tracking-widest text-matkaGold text-glow-gold drop-shadow-lg">
            MATKA PRO
          </h1>
          <p className="text-sm sm:text-base text-foreground/80 mt-1 font-semibold">
            India's Premier Online Matka Platform
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {/* Login prompt for unauthenticated users */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 sm:p-6 rounded-xl bg-matkaRed/10 border border-matkaRed/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-matkaRed/20 border border-matkaRed/40 flex items-center justify-center shrink-0">
              <LogIn className="w-6 h-6 text-matkaRed-bright" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">Login to Place Bets</h3>
              <p className="text-sm text-muted-foreground">
                You need to login to place bets. Markets are visible to all users.
              </p>
            </div>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="btn-matka-primary px-6 py-2.5 rounded-md font-bold shrink-0"
            >
              {isLoggingIn ? 'Logging in...' : 'Login Now'}
            </Button>
          </div>
        )}

        {/* Welcome message for authenticated users */}
        {isAuthenticated && userProfile && (
          <div className="mb-6 p-4 rounded-xl bg-matkaGold/5 border border-matkaGold/20 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-bold text-matkaGold">{userProfile.username}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="font-bold text-matkaGold text-lg">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                  Number(userProfile.balance) / 100
                )}
              </p>
            </div>
          </div>
        )}

        {/* Markets section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-matka text-2xl tracking-wide text-foreground">LIVE MARKETS</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-muted-foreground hover:text-matkaGold"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
        </div>

        <div className="divider-gold mb-5" />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl bg-matkaDark-raised" />
            ))}
          </div>
        ) : error ? (
          /* Even on error, show static markets */
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-matkaRed/10 border border-matkaRed/30 text-xs text-matkaRed-bright flex items-center gap-2">
              <span>⚠️</span>
              <span>Could not fetch live market status. Showing default schedules.</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {markets.map((market) => (
                <MarketCard
                  key={market.id.toString()}
                  market={market}
                  onClick={() => handleMarketClick(market.id)}
                  disabled={!isAuthenticated}
                  latestResult={gameResults ? getLatestResultForMarket(gameResults, market.name) : null}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {markets.map((market) => (
              <MarketCard
                key={market.id.toString()}
                market={market}
                onClick={() => handleMarketClick(market.id)}
                disabled={!isAuthenticated}
                latestResult={gameResults ? getLatestResultForMarket(gameResults, market.name) : null}
              />
            ))}
          </div>
        )}

        {/* Game info strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Time Bazar', time: '1:00 PM – 2:00 PM', emoji: '⏰' },
            { name: 'Milan Day', time: '3:00 PM – 5:00 PM', emoji: '🌙' },
            { name: 'Kalyan', time: '3:45 PM – 5:45 PM', emoji: '🏆' },
            { name: 'Sridevi', time: '11:30 AM – 12:30 PM', emoji: '🌸' },
          ].map((game) => (
            <div
              key={game.name}
              className="p-3 rounded-lg bg-matkaDark-surface border border-border text-center"
            >
              <p className="text-xl mb-1">{game.emoji}</p>
              <p className="font-matka text-sm tracking-wide text-foreground">{game.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{game.time}</p>
            </div>
          ))}
        </div>

        {/* Odds reference */}
        <div className="mt-6 p-4 rounded-xl bg-matkaDark-surface border border-border">
          <h3 className="font-matka text-lg tracking-wide text-matkaGold mb-3">PAYOUT RATES</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Single', odds: '9x' },
              { label: 'Jodi', odds: '90x' },
              { label: 'Single Panna', odds: '150x' },
              { label: 'Double Panna', odds: '300x' },
              { label: 'Triple Panna', odds: '600x' },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-3 rounded-lg bg-matkaDark border border-border"
              >
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="font-matka text-xl text-matkaGold text-glow-gold">{item.odds}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
