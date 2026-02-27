import React from 'react';
import { Clock, ChevronRight, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Market, Result } from '../backend';
import { Variant_closed_open } from '../backend';
import { getMarketAccent } from '../lib/staticMarkets';

interface MarketCardProps {
  market: Market;
  onClick: () => void;
  disabled?: boolean;
  latestResult?: Result | null;
}

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function MarketCard({ market, onClick, disabled, latestResult }: MarketCardProps) {
  const isOpen = market.status === Variant_closed_open.open;
  const isDisabled = disabled || !isOpen;
  const accent = getMarketAccent(market.name);

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'w-full text-left rounded-xl p-4 sm:p-5 transition-all duration-200 border relative overflow-hidden',
        isDisabled
          ? 'opacity-60 cursor-not-allowed bg-matkaDark-surface border-border'
          : 'card-matka cursor-pointer hover:scale-[1.02] active:scale-[0.99]',
      ].join(' ')}
    >
      {/* Gradient accent background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} pointer-events-none`} />

      <div className="relative flex flex-col gap-3">
        {/* Game emoji + name row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{accent.emoji}</span>
            <h3 className={`font-matka text-lg sm:text-xl tracking-wide ${accent.color} leading-tight`}>
              {market.name}
            </h3>
          </div>
          <Badge
            className={[
              'text-xs px-2 py-0.5 rounded-full font-semibold border shrink-0',
              isOpen ? 'status-open' : 'status-closed',
            ].join(' ')}
            variant="outline"
          >
            {isOpen ? '● OPEN' : '● CLOSED'}
          </Badge>
        </div>

        {/* Schedule */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-green-400" />
            <span>Open: <span className="text-foreground font-medium">{formatTime(market.openTime)}</span></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-matkaRed-bright" />
            <span>Close: <span className="text-foreground font-medium">{formatTime(market.closeTime)}</span></span>
          </span>
        </div>

        {/* Result section */}
        <div className="pt-1 border-t border-border/40">
          {latestResult ? (
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-muted-foreground">Result:</span>
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                <span className="text-green-400">{latestResult.openNumber || '-'}</span>
                <span className="text-muted-foreground">|</span>
                <span className={`text-lg leading-none ${accent.color}`}>{latestResult.jodi || '--'}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-matkaRed-bright">{latestResult.closeNumber || '-'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground italic">Result Awaited...</span>
              {!isDisabled && (
                <div className="w-7 h-7 rounded-full bg-matkaRed/15 border border-matkaRed/30 flex items-center justify-center">
                  <ChevronRight className="w-3.5 h-3.5 text-matkaRed-bright" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA row — only show when no result displayed */}
        {latestResult && !isDisabled && (
          <div className="flex items-center justify-between -mt-1">
            <p className={`text-xs font-semibold ${accent.color}`}>
              🎯 Tap to place bet
            </p>
            <div className="w-7 h-7 rounded-full bg-matkaRed/15 border border-matkaRed/30 flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5 text-matkaRed-bright" />
            </div>
          </div>
        )}

        {/* Locked state CTA */}
        {isDisabled && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground -mt-1">
            <Lock className="w-3.5 h-3.5" />
            {!isOpen ? 'Market Closed' : 'Login to Bet'}
          </div>
        )}
      </div>
    </button>
  );
}
