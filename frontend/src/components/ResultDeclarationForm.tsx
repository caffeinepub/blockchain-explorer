import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle } from 'lucide-react';
import type { Market } from '../backend';
import { useDeclareGameResult } from '../hooks/useAdminQueries';

interface ResultDeclarationFormProps {
  markets: Market[];
}

export default function ResultDeclarationForm({ markets }: ResultDeclarationFormProps) {
  const [marketId, setMarketId] = useState('');
  const [openNumber, setOpenNumber] = useState('');
  const [closeNumber, setCloseNumber] = useState('');
  const [jodi, setJodi] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { mutateAsync, isPending } = useDeclareGameResult();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!marketId) { setError('Please select a market'); return; }
    if (!/^\d$/.test(openNumber)) { setError('Open number must be a single digit (0-9)'); return; }
    if (!/^\d$/.test(closeNumber)) { setError('Close number must be a single digit (0-9)'); return; }
    if (!/^\d{2}$/.test(jodi)) { setError('Jodi must be a 2-digit number (00-99)'); return; }

    try {
      await mutateAsync({
        marketId: BigInt(marketId),
        openNumber,
        closeNumber,
        jodi,
        singlePanna: [],
        doublePanna: [],
        triplePanna: [],
      });
      setSuccess(true);
      setOpenNumber('');
      setCloseNumber('');
      setJodi('');
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message || 'Failed to declare result');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Result declared successfully! Winning bets have been credited.
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-foreground font-semibold">Select Market</Label>
        <Select value={marketId} onValueChange={setMarketId}>
          <SelectTrigger className="bg-matkaDark border-border focus:border-matkaGold/60">
            <SelectValue placeholder="Choose a market..." />
          </SelectTrigger>
          <SelectContent className="bg-matkaDark-surface border-border">
            {markets.map((m) => (
              <SelectItem key={m.id.toString()} value={m.id.toString()}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-foreground font-semibold text-xs">Open Number</Label>
          <Input
            type="text"
            inputMode="numeric"
            value={openNumber}
            onChange={(e) => setOpenNumber(e.target.value.replace(/\D/g, '').slice(0, 1))}
            placeholder="0-9"
            maxLength={1}
            className="bg-matkaDark border-border focus:border-matkaGold/60 text-center text-xl font-bold"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground font-semibold text-xs">Jodi</Label>
          <Input
            type="text"
            inputMode="numeric"
            value={jodi}
            onChange={(e) => setJodi(e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="00-99"
            maxLength={2}
            className="bg-matkaDark border-border focus:border-matkaGold/60 text-center text-xl font-bold"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground font-semibold text-xs">Close Number</Label>
          <Input
            type="text"
            inputMode="numeric"
            value={closeNumber}
            onChange={(e) => setCloseNumber(e.target.value.replace(/\D/g, '').slice(0, 1))}
            placeholder="0-9"
            maxLength={1}
            className="bg-matkaDark border-border focus:border-matkaGold/60 text-center text-xl font-bold"
          />
        </div>
      </div>

      <div className="p-3 rounded-lg bg-matkaDark-raised border border-border text-xs text-muted-foreground">
        Result format: <span className="text-matkaGold font-bold">{openNumber || '?'} {jodi || '??'} {closeNumber || '?'}</span>
      </div>

      {error && <p className="text-xs text-matkaRed-bright">{error}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full btn-matka-primary rounded-md py-2.5 font-bold"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Declaring...
          </>
        ) : (
          'Declare Result'
        )}
      </Button>
    </form>
  );
}
