import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Bet } from '../backend';
import { Variant_won_pending_lost } from '../backend';
import { BET_TYPE_LABELS } from '../utils/matkaOdds';
import { formatPaiseToINR } from '../utils/currency';

interface BetHistoryTableProps {
  bets: Bet[];
  marketNames: Record<string, string>;
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BetHistoryTable({ bets, marketNames }: BetHistoryTableProps) {
  if (bets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">🎲</p>
        <p className="font-semibold">No bets placed yet</p>
        <p className="text-sm mt-1">Head to the Markets page to place your first bet!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-matka">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground text-xs">Market</TableHead>
            <TableHead className="text-muted-foreground text-xs">Type</TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">Number</TableHead>
            <TableHead className="text-muted-foreground text-xs text-right">Amount</TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">Status</TableHead>
            <TableHead className="text-muted-foreground text-xs text-right">Payout</TableHead>
            <TableHead className="text-muted-foreground text-xs">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet) => {
            const marketName = marketNames[bet.marketId.toString()] || `Market #${bet.marketId}`;
            const isWon = bet.status === Variant_won_pending_lost.won;
            const isLost = bet.status === Variant_won_pending_lost.lost;
            const isPending = bet.status === Variant_won_pending_lost.pending;

            return (
              <TableRow key={bet.id.toString()} className="border-border hover:bg-matkaDark-raised/50">
                <TableCell className="font-medium text-sm">{marketName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {BET_TYPE_LABELS[bet.betType]}
                </TableCell>
                <TableCell className="text-center font-bold text-lg tracking-widest text-matkaRed-bright">
                  {bet.number}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold">
                  {formatPaiseToINR(bet.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={[
                      'text-xs px-2 py-0.5 rounded-full border',
                      isWon ? 'status-open' : isLost ? 'status-closed text-matkaRed-bright border-matkaRed/30 bg-matkaRed/10' : 'status-pending border-matkaGold/30 bg-matkaGold/10',
                    ].join(' ')}
                  >
                    {isWon ? '✓ WON' : isLost ? '✗ LOST' : '⏳ PENDING'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm font-bold">
                  {isWon && bet.payout ? (
                    <span className="text-green-400">{formatPaiseToINR(bet.payout)}</span>
                  ) : isLost ? (
                    <span className="text-matkaRed-bright">-{formatPaiseToINR(bet.amount)}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(bet.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
