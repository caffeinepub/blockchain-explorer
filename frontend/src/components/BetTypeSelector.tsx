import React from 'react';
import { BetType } from '../backend';
import { BET_TYPE_LABELS, BET_TYPE_DESCRIPTIONS, MATKA_ODDS } from '../utils/matkaOdds';

interface BetTypeSelectorProps {
  selected: BetType;
  onChange: (type: BetType) => void;
}

const BET_TYPES = [
  BetType.single,
  BetType.jodi,
  BetType.singlePanna,
  BetType.doublePanna,
  BetType.triplePanna,
];

export default function BetTypeSelector({ selected, onChange }: BetTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {BET_TYPES.map((type) => {
        const isSelected = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={[
              'p-3 rounded-lg border text-left transition-all duration-150',
              isSelected
                ? 'bg-matkaRed/20 border-matkaRed/60 glow-red'
                : 'bg-matkaDark-surface border-border hover:border-matkaGold/40 hover:bg-matkaDark-raised',
            ].join(' ')}
          >
            <div className="font-bold text-sm text-foreground mb-0.5">
              {BET_TYPE_LABELS[type]}
            </div>
            <div className="text-xs text-matkaGold font-semibold">
              {MATKA_ODDS[type]}x payout
            </div>
          </button>
        );
      })}
    </div>
  );
}
