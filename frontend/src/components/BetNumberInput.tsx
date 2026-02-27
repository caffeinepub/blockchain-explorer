import React from 'react';
import { BetType } from '../backend';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BetNumberInputProps {
  betType: BetType;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PLACEHOLDERS: Record<BetType, string> = {
  [BetType.single]: 'e.g. 5',
  [BetType.jodi]: 'e.g. 47',
  [BetType.singlePanna]: 'e.g. 123',
  [BetType.doublePanna]: 'e.g. 112',
  [BetType.triplePanna]: 'e.g. 000',
};

const MAX_LENGTHS: Record<BetType, number> = {
  [BetType.single]: 1,
  [BetType.jodi]: 2,
  [BetType.singlePanna]: 3,
  [BetType.doublePanna]: 3,
  [BetType.triplePanna]: 3,
};

export default function BetNumberInput({ betType, value, onChange, error }: BetNumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= MAX_LENGTHS[betType]) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-foreground font-semibold">Your Number</Label>
      <Input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={PLACEHOLDERS[betType]}
        maxLength={MAX_LENGTHS[betType]}
        className={[
          'bg-matkaDark border text-center text-2xl font-bold tracking-widest h-14',
          error
            ? 'border-matkaRed-bright focus:border-matkaRed-bright'
            : 'border-border focus:border-matkaGold/60',
        ].join(' ')}
      />
      {error && <p className="text-xs text-matkaRed-bright">{error}</p>}
    </div>
  );
}
