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
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { WithdrawalRequest } from '../backend';
import { formatPaiseToINR } from '../utils/currency';
import { useApproveWithdrawalRequest, useRejectWithdrawalRequest } from '../hooks/useAdminQueries';

interface WithdrawalRequestsTableProps {
  requests: WithdrawalRequest[];
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function WithdrawalRequestsTable({ requests }: WithdrawalRequestsTableProps) {
  const approveMutation = useApproveWithdrawalRequest();
  const rejectMutation = useRejectWithdrawalRequest();

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No pending withdrawal requests.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-matka">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground text-xs">User</TableHead>
            <TableHead className="text-muted-foreground text-xs text-right">Amount</TableHead>
            <TableHead className="text-muted-foreground text-xs">UPI ID</TableHead>
            <TableHead className="text-muted-foreground text-xs">Date</TableHead>
            <TableHead className="text-muted-foreground text-xs text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => {
            const isApproving = approveMutation.isPending && approveMutation.variables === req.id;
            const isRejecting = rejectMutation.isPending && rejectMutation.variables === req.id;
            const isBusy = isApproving || isRejecting;

            return (
              <TableRow key={req.id.toString()} className="border-border hover:bg-matkaDark-raised/50">
                <TableCell className="text-xs font-mono text-muted-foreground max-w-[100px] truncate">
                  {req.userId.toString().slice(0, 12)}...
                </TableCell>
                <TableCell className="text-right font-bold text-sm text-matkaRed-bright">
                  {formatPaiseToINR(req.amount)}
                </TableCell>
                <TableCell className="text-xs font-mono">{req.upiId}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(req.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      disabled={isBusy}
                      onClick={() => approveMutation.mutate(req.id)}
                      className="h-7 px-2 bg-green-600/20 border border-green-500/40 text-green-400 hover:bg-green-600/30 text-xs"
                    >
                      {isApproving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                      <span className="ml-1">Approve</span>
                    </Button>
                    <Button
                      size="sm"
                      disabled={isBusy}
                      onClick={() => rejectMutation.mutate(req.id)}
                      className="h-7 px-2 bg-matkaRed/20 border border-matkaRed/40 text-matkaRed-bright hover:bg-matkaRed/30 text-xs"
                    >
                      {isRejecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                      <span className="ml-1">Reject</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
