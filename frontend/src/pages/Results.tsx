import React, { useState } from 'react';
import { useGetGameResults } from '../hooks/useGameResultsQueries';
import { STATIC_MARKETS, getMarketAccent } from '../lib/staticMarkets';
import { RefreshCw, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Result } from '../backend';

const ALL_MARKET_NAMES = STATIC_MARKETS.map((m) => m.name);

function formatResultDate(timeNs: bigint): string {
  const ms = Number(timeNs) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatResultTime(timeNs: bigint): string {
  const ms = Number(timeNs) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

interface ResultRowProps {
  result: Result;
  marketName: string;
}

function ResultRow({ result, marketName }: ResultRowProps) {
  const accent = getMarketAccent(marketName);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg bg-matkaDark border border-border hover:border-border/80 transition-colors">
      {/* Date/Time */}
      <div className="flex items-center gap-2 sm:w-36 shrink-0">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-xs font-medium text-foreground">{formatResultDate(result.time)}</p>
          <p className="text-xs text-muted-foreground">{formatResultTime(result.time)}</p>
        </div>
      </div>

      {/* Market name */}
      <div className="flex items-center gap-2 sm:w-32 shrink-0">
        <span className="text-base leading-none">{accent.emoji}</span>
        <span className={`text-sm font-matka tracking-wide ${accent.color}`}>{marketName}</span>
      </div>

      {/* Result numbers */}
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Open</span>
          <span className="font-mono font-bold text-green-400 text-base">
            {result.openNumber || '-'}
          </span>
        </div>
        <span className="text-muted-foreground">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Jodi</span>
          <span className={`font-mono font-bold text-xl ${accent.color}`}>
            {result.jodi || '--'}
          </span>
        </div>
        <span className="text-muted-foreground">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Close</span>
          <span className="font-mono font-bold text-matkaRed-bright text-base">
            {result.closeNumber || '-'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const [selectedMarket, setSelectedMarket] = useState<string>('All');
  const { data: gameResults, isLoading, refetch, isFetching } = useGetGameResults(ALL_MARKET_NAMES);

  // Build a flat list of results with market name, sorted newest first
  const allResultsFlat: { result: Result; marketName: string }[] = [];
  if (gameResults) {
    for (const mr of gameResults) {
      for (const r of mr.results) {
        allResultsFlat.push({ result: r, marketName: mr.marktetId });
      }
    }
  }
  allResultsFlat.sort((a, b) => Number(b.result.time - a.result.time));

  const filteredResults =
    selectedMarket === 'All'
      ? allResultsFlat
      : allResultsFlat.filter((r) => r.marketName === selectedMarket);

  const marketFilters = ['All', ...ALL_MARKET_NAMES];

  return (
    <div className="flex-1">
      {/* Page header */}
      <div className="bg-matkaDark-surface border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-matkaGold/10 border border-matkaGold/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-matkaGold" />
              </div>
              <div>
                <h1 className="font-matka text-2xl sm:text-3xl tracking-widest text-matkaGold text-glow-gold">
                  GAME RESULTS
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest declared results for all markets
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-muted-foreground hover:text-matkaGold shrink-0"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {/* Market filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {marketFilters.map((name) => {
            const accent = name !== 'All' ? getMarketAccent(name) : null;
            const isActive = selectedMarket === name;
            return (
              <button
                key={name}
                onClick={() => setSelectedMarket(name)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                  isActive
                    ? 'bg-matkaGold/20 text-matkaGold border-matkaGold/50'
                    : 'bg-matkaDark-surface text-muted-foreground border-border hover:border-matkaGold/30 hover:text-foreground',
                ].join(' ')}
              >
                {accent && <span>{accent.emoji}</span>}
                {name}
              </button>
            );
          })}
        </div>

        {/* Results list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg bg-matkaDark-raised" />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-matkaDark-surface border border-border flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-matka text-lg tracking-wide text-foreground mb-2">
              No Results Yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {selectedMarket === 'All'
                ? 'No game results have been declared yet. Check back after market close.'
                : `No results declared for ${selectedMarket} yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Summary badge */}
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="text-xs text-muted-foreground border-border">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
              </Badge>
            </div>
            {filteredResults.map((item, idx) => (
              <ResultRow
                key={`${item.marketName}-${item.result.time.toString()}-${idx}`}
                result={item.result}
                marketName={item.marketName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
