import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllMarkets, useGetAllGameTypes } from '../hooks/useMarketQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { usePlaceBet } from '../hooks/useBetQueries';
import BetTypeSelector from '../components/BetTypeSelector';
import BetNumberInput from '../components/BetNumberInput';
import BetConfirmationDialog from '../components/BetConfirmationDialog';
import { BetType, Variant_closed_open } from '../backend';
import { validateBetNumber, calculatePayout } from '../utils/matkaOdds';
import { formatPaiseToINR, rupeesToPaise } from '../utils/currency';
import { mergeMarkets } from '../lib/staticMarkets';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Wallet, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function BetPlacement() {
  const { marketId } = useParams({ from: '/bet/$marketId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: backendMarkets, isLoading: marketsLoading } = useGetAllMarkets();
  const { data: gameTypes, isLoading: gameTypesLoading } = useGetAllGameTypes();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const placeBetMutation = usePlaceBet();

  const [betType, setBetType] = useState<BetType>(BetType.single);
  const [number, setNumber] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [numberError, setNumberError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [betSuccess, setBetSuccess] = useState(false);

  // Merge backend markets with static fallback
  const markets = mergeMarkets(backendMarkets ?? []);
  const market = markets.find((m) => m.id.toString() === marketId);
  const gameType = gameTypes?.find((gt) => gt.marketId.toString() === marketId);

  const isLoading = marketsLoading || gameTypesLoading || profileLoading;

  if (!identity) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-matkaRed-bright mx-auto mb-4" />
        <h2 className="font-matka text-2xl text-foreground mb-2">LOGIN REQUIRED</h2>
        <p className="text-muted-foreground mb-6">Please login to place bets.</p>
        <Button onClick={() => navigate({ to: '/' })} className="btn-matka-primary rounded-md px-6">
          Go to Markets
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-48 bg-matkaDark-raised" />
        <Skeleton className="h-64 rounded-xl bg-matkaDark-raised" />
      </div>
    );
  }

  if (!market) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">Market not found.</p>
        <Button onClick={() => navigate({ to: '/' })} variant="outline">
          Back to Markets
        </Button>
      </div>
    );
  }

  const isMarketOpen = market.status === Variant_closed_open.open;
  const amountNum = parseFloat(amountStr);
  const amountPaise = !isNaN(amountNum) && amountNum > 0 ? rupeesToPaise(amountNum) : 0n;
  const expectedPayout = amountPaise > 0n ? calculatePayout(betType, amountPaise) : 0n;
  const balance = userProfile?.balance ?? 0n;
  const hasInsufficientBalance = amountPaise > balance;
  const isBelowMinimum = amountPaise > 0n && amountPaise < 1000n;

  const handleBetTypeChange = (type: BetType) => {
    setBetType(type);
    setNumber('');
    setNumberError('');
  };

  const handlePlaceBet = () => {
    const numError = validateBetNumber(betType, number);
    if (numError) {
      setNumberError(numError);
      return;
    }
    setNumberError('');

    if (!amountStr || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }
    if (isBelowMinimum) {
      toast.error('Minimum bet amount is ₹10');
      return;
    }
    if (hasInsufficientBalance) {
      toast.error('Insufficient balance');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmBet = async () => {
    if (!gameType) {
      toast.error('Game type not available for this market. Please contact admin.');
      return;
    }
    try {
      await placeBetMutation.mutateAsync({
        gameTypeId: gameType.id,
        betType,
        number,
        amount: amountPaise,
      });
      setShowConfirm(false);
      setBetSuccess(true);
      setNumber('');
      setAmountStr('');
      toast.success('Bet placed successfully!');
    } catch (err: unknown) {
      const e = err as Error;
      setShowConfirm(false);
      toast.error(e?.message || 'Failed to place bet');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Markets
      </button>

      {/* Market header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-matka text-2xl sm:text-3xl tracking-wide text-foreground">
            {market.name}
          </h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
              isMarketOpen ? 'status-open' : 'status-closed'
            }`}
          >
            {isMarketOpen ? '● OPEN' : '● CLOSED'}
          </span>
        </div>
        {/* Schedule info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-green-400" />
            Open: {new Date(Number(market.openTime) / 1_000_000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-matkaRed-bright" />
            Close: {new Date(Number(market.closeTime) / 1_000_000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </div>

      {!isMarketOpen ? (
        <div className="p-6 rounded-xl bg-matkaDark-surface border border-border text-center">
          <p className="text-muted-foreground font-semibold">
            This market is currently closed for betting.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please check back during open hours.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Balance display */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-matkaDark-surface border border-matkaGold/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="w-4 h-4 text-matkaGold" />
              Your Balance
            </div>
            <span className="font-bold text-matkaGold">{formatPaiseToINR(balance)}</span>
          </div>

          {betSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Bet placed successfully! Good luck! 🎲
            </div>
          )}

          {/* Bet type selector */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold text-base">Select Bet Type</Label>
            <BetTypeSelector selected={betType} onChange={handleBetTypeChange} />
          </div>

          {/* Number input */}
          <BetNumberInput
            betType={betType}
            value={number}
            onChange={(v) => {
              setNumber(v);
              setNumberError('');
            }}
            error={numberError}
          />

          {/* Amount input */}
          <div className="space-y-1.5">
            <Label className="text-foreground font-semibold">Bet Amount (₹)</Label>
            <Input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="Min ₹10"
              min="10"
              className={[
                'bg-matkaDark border text-lg font-bold h-12',
                hasInsufficientBalance || isBelowMinimum
                  ? 'border-matkaRed-bright focus:border-matkaRed-bright'
                  : 'border-border focus:border-matkaGold/60',
              ].join(' ')}
            />
            <div className="flex gap-2 flex-wrap">
              {[10, 50, 100, 500, 1000].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmountStr(a.toString())}
                  className="px-3 py-1 text-xs rounded-md bg-matkaDark-raised border border-border hover:border-matkaGold/40 hover:text-matkaGold transition-colors"
                >
                  ₹{a}
                </button>
              ))}
            </div>
            {isBelowMinimum && (
              <p className="text-xs text-matkaRed-bright">Minimum bet amount is ₹10</p>
            )}
            {hasInsufficientBalance && !isBelowMinimum && (
              <p className="text-xs text-matkaRed-bright">
                Insufficient balance. Available: {formatPaiseToINR(balance)}
              </p>
            )}
          </div>

          {/* Expected payout */}
          {amountPaise > 0n && !isBelowMinimum && (
            <div className="p-4 rounded-xl bg-matkaDark-surface border border-matkaGold/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expected Payout</span>
                <span className="font-bold text-matkaGold text-lg text-glow-gold">
                  {formatPaiseToINR(expectedPayout)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                If your number matches the result
              </p>
            </div>
          )}

          {/* Place bet button */}
          <Button
            onClick={handlePlaceBet}
            disabled={!number || !amountStr || hasInsufficientBalance || isBelowMinimum}
            className="w-full btn-matka-primary rounded-md py-3 text-base font-bold"
          >
            Place Bet
          </Button>
        </div>
      )}

      {/* Confirmation dialog */}
      <BetConfirmationDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmBet}
        betType={betType}
        number={number}
        amountPaise={amountPaise}
        marketName={market.name}
        isLoading={placeBetMutation.isPending}
      />
    </div>
  );
}
