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
import type { Transaction } from '../backend';
import { formatPaiseToINR } from '../utils/currency';

interface TransactionHistoryTableProps {
  transactions: Transaction[];
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

function getTransactionLabel(tx: Transaction): { label: string; isCredit: boolean } {
  switch (tx.transactionType.__kind__) {
    case 'depositRequest':
      return { label: 'Deposit', isCredit: true };
    case 'withdrawalRequest':
      return { label: 'Withdrawal', isCredit: false };
    case 'betPlacement':
      return { label: 'Bet Placed', isCredit: false };
    case 'winningPayout':
      return { label: 'Winning', isCredit: true };
    default:
      return { label: 'Transaction', isCredit: false };
  }
}

export default function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p className="text-3xl mb-2">💳</p>
        <p className="font-semibold">No transactions yet</p>
        <p className="text-sm mt-1">Deposit funds to get started!</p>
      </div>
    );
  }

  const sorted = [...transactions].sort((a, b) => Number(b.createdAt - a.createdAt));

  return (
    <div className="overflow-x-auto scrollbar-matka">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground text-xs">Type</TableHead>
            <TableHead className="text-muted-foreground text-xs text-right">Amount</TableHead>
            <TableHead className="text-muted-foreground text-xs">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((tx) => {
            const { label, isCredit } = getTransactionLabel(tx);
            return (
              <TableRow key={tx.id.toString()} className="border-border hover:bg-matkaDark-raised/50">
                <TableCell>
                  <Badge
                    variant="outline"
                    className={[
                      'text-xs px-2 py-0.5 rounded-full border',
                      isCredit
                        ? 'text-green-400 border-green-500/30 bg-green-500/10'
                        : 'text-matkaRed-bright border-matkaRed/30 bg-matkaRed/10',
                    ].join(' ')}
                  >
                    {isCredit ? '↑' : '↓'} {label}
                  </Badge>
                </TableCell>
                <TableCell className={['text-right font-bold text-sm', isCredit ? 'text-green-400' : 'text-matkaRed-bright'].join(' ')}>
                  {isCredit ? '+' : '-'}{formatPaiseToINR(tx.amount)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(tx.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
