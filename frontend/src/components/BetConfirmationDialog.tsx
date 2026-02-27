import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { BetType } from '../backend';
import { BET_TYPE_LABELS, calculatePayout } from '../utils/matkaOdds';
import { formatPaiseToINR } from '../utils/currency';
import { Loader2 } from 'lucide-react';

interface BetConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  betType: BetType;
  number: string;
  amountPaise: bigint;
  marketName: string;
  isLoading: boolean;
}

export default function BetConfirmationDialog({
  open,
  onClose,
  onConfirm,
  betType,
  number,
  amountPaise,
  marketName,
  isLoading,
}: BetConfirmationDialogProps) {
  const expectedPayout = calculatePayout(betType, amountPaise);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-matkaDark-surface border border-matkaGold/30 max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-matkaGold font-matka tracking-wide text-xl">
            Confirm Your Bet
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 mt-2">
              <div className="bg-matkaDark rounded-lg p-4 border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market</span>
                  <span className="font-semibold text-foreground">{marketName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bet Type</span>
                  <span className="font-semibold text-foreground">{BET_TYPE_LABELS[betType]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Number</span>
                  <span className="font-bold text-2xl text-matkaRed-bright tracking-widest">{number}</span>
                </div>
                <div className="divider-gold my-1" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bet Amount</span>
                  <span className="font-bold text-foreground">{formatPaiseToINR(amountPaise)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Payout</span>
                  <span className="font-bold text-matkaGold text-glow-gold">{formatPaiseToINR(expectedPayout)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                This amount will be deducted from your wallet immediately.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="bg-matkaDark-raised border-border hover:bg-matkaDark-surface"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-matka-primary rounded-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Placing...
              </>
            ) : (
              'Place Bet'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
