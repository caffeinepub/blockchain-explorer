import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetBetHistory } from '../hooks/useBetHistoryQueries';
import { useGetAllMarkets } from '../hooks/useMarketQueries';
import BetHistoryTable from '../components/BetHistoryTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, LogIn } from 'lucide-react';

export default function MyBets() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: bets, isLoading: betsLoading, refetch } = useGetBetHistory();
  const { data: markets } = useGetAllMarkets();

  const marketNames: Record<string, string> = {};
  if (markets) {
    markets.forEach((m) => {
      marketNames[m.id.toString()] = m.name;
    });
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-matkaRed/15 border border-matkaRed/30 flex items-center justify-center mx-auto mb-5">
          <LogIn className="w-8 h-8 text-matkaRed-bright" />
        </div>
        <h2 className="font-matka text-2xl tracking-wide text-foreground mb-2">LOGIN REQUIRED</h2>
        <p className="text-muted-foreground mb-6">Please login to view your bet history.</p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="btn-matka-primary px-6 py-2.5 rounded-md font-bold"
        >
          {isLoggingIn ? 'Logging in...' : 'Login Now'}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-matka text-2xl sm:text-3xl tracking-wide text-foreground">MY BETS</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your complete betting history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-muted-foreground hover:text-matkaGold"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
          <Button
            onClick={() => navigate({ to: '/' })}
            className="btn-matka-primary px-4 py-2 rounded-md text-sm font-bold"
          >
            Place New Bet
          </Button>
        </div>
      </div>

      <div className="divider-gold mb-5" />

      {/* Stats summary */}
      {bets && bets.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: 'Total Bets',
              value: bets.length.toString(),
              color: 'text-foreground',
            },
            {
              label: 'Won',
              value: bets.filter((b) => b.status === 'won').length.toString(),
              color: 'text-green-400',
            },
            {
              label: 'Pending',
              value: bets.filter((b) => b.status === 'pending').length.toString(),
              color: 'text-matkaGold',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-xl bg-matkaDark-surface border border-border text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`font-bold text-xl font-matka ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bets table */}
      <div className="rounded-xl bg-matkaDark-surface border border-border overflow-hidden">
        {betsLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg bg-matkaDark-raised" />
            ))}
          </div>
        ) : (
          <BetHistoryTable bets={bets ?? []} marketNames={marketNames} />
        )}
      </div>
    </div>
  );
}
