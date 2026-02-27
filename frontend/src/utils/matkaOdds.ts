import { BetType } from '../backend';

/**
 * Standard Matka odds multipliers
 */
export const MATKA_ODDS: Record<BetType, number> = {
  [BetType.single]: 9,
  [BetType.jodi]: 90,
  [BetType.singlePanna]: 150,
  [BetType.doublePanna]: 300,
  [BetType.triplePanna]: 600,
};

export const BET_TYPE_LABELS: Record<BetType, string> = {
  [BetType.single]: 'Single (0-9)',
  [BetType.jodi]: 'Jodi (00-99)',
  [BetType.singlePanna]: 'Single Panna',
  [BetType.doublePanna]: 'Double Panna',
  [BetType.triplePanna]: 'Triple Panna',
};

export const BET_TYPE_DESCRIPTIONS: Record<BetType, string> = {
  [BetType.single]: 'Pick a single digit (0-9). Pays 9x.',
  [BetType.jodi]: 'Pick a two-digit number (00-99). Pays 90x.',
  [BetType.singlePanna]: 'Pick a 3-digit Panna with all different digits. Pays 150x.',
  [BetType.doublePanna]: 'Pick a 3-digit Panna with two same digits. Pays 300x.',
  [BetType.triplePanna]: 'Pick a 3-digit Panna with all same digits. Pays 600x.',
};

/**
 * Calculate expected payout in paise
 */
export function calculatePayout(betType: BetType, amountPaise: bigint): bigint {
  const multiplier = MATKA_ODDS[betType];
  return amountPaise * BigInt(multiplier);
}

/**
 * Validate a bet number based on bet type
 */
export function validateBetNumber(betType: BetType, number: string): string | null {
  const trimmed = number.trim();
  if (!trimmed) return 'Please enter a number';

  switch (betType) {
    case BetType.single: {
      if (!/^\d$/.test(trimmed)) return 'Single must be a digit 0-9';
      return null;
    }
    case BetType.jodi: {
      if (!/^\d{2}$/.test(trimmed)) return 'Jodi must be a 2-digit number (00-99)';
      return null;
    }
    case BetType.singlePanna: {
      if (!/^\d{3}$/.test(trimmed)) return 'Panna must be a 3-digit number';
      const digits = trimmed.split('');
      const unique = new Set(digits);
      if (unique.size !== 3) return 'Single Panna must have all different digits';
      return null;
    }
    case BetType.doublePanna: {
      if (!/^\d{3}$/.test(trimmed)) return 'Panna must be a 3-digit number';
      const digits = trimmed.split('');
      const unique = new Set(digits);
      if (unique.size !== 2) return 'Double Panna must have exactly two same digits';
      return null;
    }
    case BetType.triplePanna: {
      if (!/^\d{3}$/.test(trimmed)) return 'Panna must be a 3-digit number';
      const digits = trimmed.split('');
      const unique = new Set(digits);
      if (unique.size !== 1) return 'Triple Panna must have all same digits (e.g. 000, 111)';
      return null;
    }
    default:
      return 'Invalid bet type';
  }
}
