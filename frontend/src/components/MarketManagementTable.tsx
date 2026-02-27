import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { Market } from '../backend';
import { Variant_closed_open } from '../backend';
import { useUpdateMarketStatus } from '../hooks/useAdminQueries';

interface MarketManagementTableProps {
  markets: Market[];
}

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function MarketManagementTable({ markets }: MarketManagementTableProps) {
  const updateStatusMutation = useUpdateMarketStatus();

  if (markets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No markets created yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-matka">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground text-xs">Market Name</TableHead>
            <TableHead className="text-muted-foreground text-xs">Open Time</TableHead>
            <TableHead className="text-muted-foreground text-xs">Close Time</TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">Status</TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {markets.map((market) => {
            const isOpen = market.status === Variant_closed_open.open;
            const isUpdating =
              updateStatusMutation.isPending &&
              (updateStatusMutation.variables as { marketId: bigint })?.marketId === market.id;

            return (
              <TableRow key={market.id.toString()} className="border-border hover:bg-matkaDark-raised/50">
                <TableCell className="font-semibold">{market.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatTime(market.openTime)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatTime(market.closeTime)}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-0.5 rounded-full border ${isOpen ? 'status-open' : 'status-closed'}`}
                  >
                    {isOpen ? '● OPEN' : '● CLOSED'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        marketId: market.id,
                        status: isOpen ? Variant_closed_open.closed : Variant_closed_open.open,
                      })
                    }
                    className={[
                      'h-7 px-3 text-xs font-semibold',
                      isOpen
                        ? 'bg-matkaRed/20 border border-matkaRed/40 text-matkaRed-bright hover:bg-matkaRed/30'
                        : 'bg-green-600/20 border border-green-500/40 text-green-400 hover:bg-green-600/30',
                    ].join(' ')}
                  >
                    {isUpdating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isOpen ? (
                      'Close Market'
                    ) : (
                      'Open Market'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
