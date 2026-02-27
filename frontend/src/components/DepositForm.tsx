import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { useSubmitDepositRequest } from '../hooks/useWalletQueries';
import { rupeesToPaise } from '../utils/currency';

export default function DepositForm() {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { mutateAsync, isPending } = useSubmitDepositRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum < 100) {
      setError('Minimum deposit amount is ₹100');
      return;
    }
    if (!utr.trim() || utr.trim().length < 6) {
      setError('Please enter a valid UTR reference (min 6 characters)');
      return;
    }

    try {
      await mutateAsync({ amount: rupeesToPaise(amountNum), utr: utr.trim() });
      setSuccess(true);
      setAmount('');
      setUtr('');
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message || 'Failed to submit deposit request');
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Deposit request submitted! Admin will approve within 24 hours.
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-foreground font-semibold">Amount (₹)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="100"
          className="bg-matkaDark border-border focus:border-matkaGold/60"
        />
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a.toString())}
              className="px-3 py-1 text-xs rounded-md bg-matkaDark-raised border border-border hover:border-matkaGold/40 hover:text-matkaGold transition-colors"
            >
              ₹{a.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-foreground font-semibold">UTR Reference Number</Label>
        <Input
          type="text"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="Enter UTR/transaction reference"
          className="bg-matkaDark border-border focus:border-matkaGold/60"
        />
        <p className="text-xs text-muted-foreground">
          Transfer money to our UPI ID and enter the UTR number from your bank app.
        </p>
      </div>

      {error && <p className="text-xs text-matkaRed-bright">{error}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full btn-matka-gold rounded-md py-2.5 font-bold"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Deposit Request'
        )}
      </Button>
    </form>
  );
}
