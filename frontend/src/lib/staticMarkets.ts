import type { Market } from '../backend';
import { Variant_closed_open } from '../backend';

// Real Matka game schedules (times stored as nanoseconds from epoch for today)
function todayTimeNs(hour: number, minute: number): bigint {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  return BigInt(d.getTime()) * 1_000_000n;
}

export const STATIC_MARKETS: Market[] = [
  {
    id: 1n,
    name: 'Time Bazar',
    openTime: todayTimeNs(13, 0),
    closeTime: todayTimeNs(14, 0),
    status: Variant_closed_open.open,
    createdAt: 0n,
  },
  {
    id: 2n,
    name: 'Milan Day',
    openTime: todayTimeNs(15, 0),
    closeTime: todayTimeNs(17, 0),
    status: Variant_closed_open.open,
    createdAt: 0n,
  },
  {
    id: 3n,
    name: 'Kalyan',
    openTime: todayTimeNs(15, 45),
    closeTime: todayTimeNs(17, 45),
    status: Variant_closed_open.open,
    createdAt: 0n,
  },
  {
    id: 4n,
    name: 'Sridevi',
    openTime: todayTimeNs(11, 30),
    closeTime: todayTimeNs(12, 30),
    status: Variant_closed_open.open,
    createdAt: 0n,
  },
];

// Game-specific accent colors for visual distinction
export const MARKET_ACCENTS: Record<string, { color: string; emoji: string; gradient: string }> = {
  'Kalyan': {
    color: 'text-matkaGold',
    emoji: '🏆',
    gradient: 'from-matkaGold/10 to-transparent',
  },
  'Milan Day': {
    color: 'text-blue-400',
    emoji: '🌙',
    gradient: 'from-blue-500/10 to-transparent',
  },
  'Time Bazar': {
    color: 'text-purple-400',
    emoji: '⏰',
    gradient: 'from-purple-500/10 to-transparent',
  },
  'Sridevi': {
    color: 'text-pink-400',
    emoji: '🌸',
    gradient: 'from-pink-500/10 to-transparent',
  },
  'Milan Night': {
    color: 'text-indigo-400',
    emoji: '🌃',
    gradient: 'from-indigo-500/10 to-transparent',
  },
};

export function getMarketAccent(name: string) {
  return MARKET_ACCENTS[name] ?? {
    color: 'text-matkaRed-bright',
    emoji: '🎲',
    gradient: 'from-matkaRed/10 to-transparent',
  };
}

/**
 * Merge backend markets with static markets.
 * If backend has markets, use those. Otherwise fall back to static.
 * Static markets are always shown if not overridden by backend data.
 */
export function mergeMarkets(backendMarkets: Market[]): Market[] {
  if (backendMarkets.length > 0) {
    return backendMarkets;
  }
  return STATIC_MARKETS;
}
