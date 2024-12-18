export interface Modifier {
  multiplier: number;
  sensitivity: number;
}

export type Modifiers = {
  [key in "default" | "shiftKey" | "ctrlKey" | "altKey" | "metaKey"]: Modifier;
};

export const defaultModifiers: Modifiers = {
  default: { multiplier: 1, sensitivity: 1 },
  ctrlKey: { multiplier: 1, sensitivity: 1 },
  shiftKey: { multiplier: 10, sensitivity: 0.5 },
  metaKey: { multiplier: 1, sensitivity: 1 },
  altKey: { multiplier: 1, sensitivity: 1 },
};

export function formatNumber(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    // if multiplier is 0.1, always show 1 decimal
    minimumFractionDigits: decimals,
    // avoid .1 + .2 = .30000000000000004 floating point "error"
    maximumFractionDigits: Math.max(6, decimals),
    useGrouping: false,
  }).format(value);
}

export function getDecimalPlaces(multiplier: number): number {
  if (multiplier >= 1) return 0;
  return Math.abs(Math.floor(Math.log10(multiplier)));
}
