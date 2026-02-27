import React from 'react';
import { Clock, ChevronRight, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Market } from '../backend';
import { Variant_closed_open } from '../backend';

interface MarketCardProps {
  market: Market;
  onClick: () => void;
  disabled?: boolean;
}

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function MarketCard({ market, onClick, disabled }: MarketCardProps) {
  const isOpen = market.status === Variant_closed_open.open;
  const isDisabled = disabled || !isOpen;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'w-full text-left rounded-xl p-4 sm:p-5 transition-all duration-200 border',
        isDisabled
          ? 'opacity-60 cursor-not-allowed bg-matkaDark-surface border-border'
          : 'card-matka cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-matka text-lg sm:text-xl tracking-wide text-foreground truncate">
              {market.name}
            </h3>
            <Badge
              className={[
                'text-xs px-2 py-0.5 rounded-full font-semibold border',
                isOpen ? 'status-open' : 'status-closed',
              ].join(' ')}
              variant="outline"
            >
              {isOpen ? '● OPEN' : '● CLOSED'}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Open: {formatTime(market.openTime)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Close: {formatTime(market.closeTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDisabled ? (
            <Lock className="w-5 h-5 text-muted-foreground" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-matkaRed/15 border border-matkaRed/30 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-matkaRed-bright" />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-matkaGold font-semibold">
            🎯 Click to place your bet
          </p>
        </div>
      )}
    </button>
  );
}
