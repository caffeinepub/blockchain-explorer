import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { useSubmitWithdrawalRequest } from '../hooks/useWalletQueries';
import { rupeesToPaise, formatPaiseToINR } from '../utils/currency';

interface WithdrawalFormProps {
  balance: bigint;
}

export default function WithdrawalForm({ balance }: WithdrawalFormProps) {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { mutateAsync, isPending } = useSubmitWithdrawalRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum < 100) {
      setError('Minimum withdrawal amount is ₹100');
      return;
    }
    const amountPaise = rupeesToPaise(amountNum);
    if (amountPaise > balance) {
      setError(`Insufficient balance. Available: ${formatPaiseToINR(balance)}`);
      return;
    }
    if (!upiId.trim() || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }

    try {
      await mutateAsync({ amount: amountPaise, upiId: upiId.trim() });
      setSuccess(true);
      setAmount('');
      setUpiId('');
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message || 'Failed to submit withdrawal request');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Withdrawal request submitted! Admin will process within 24 hours.
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
          max={Number(balance) / 100}
          className="bg-matkaDark border-border focus:border-matkaGold/60"
        />
        <p className="text-xs text-muted-foreground">
          Available: <span className="text-matkaGold font-semibold">{formatPaiseToINR(balance)}</span>
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-foreground font-semibold">UPI ID</Label>
        <Input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="e.g. yourname@paytm"
          className="bg-matkaDark border-border focus:border-matkaGold/60"
        />
      </div>

      {error && <p className="text-xs text-matkaRed-bright">{error}</p>}

      <Button
        type="submit"
        disabled={isPending || balance === 0n}
        className="w-full btn-matka-primary rounded-md py-2.5 font-bold"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Withdrawal Request'
        )}
      </Button>
    </form>
  );
}
