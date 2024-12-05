export const defaultModifier = { multiplier: 1, sensitivity: 1 };
export const defaultModifiers = {
  default: defaultModifier,
  ctrlKey: defaultModifier,
  shiftKey: {
    multiplier: 10,
    sensitivity: 0.5,
  },
  metaKey: defaultModifier,
  altKey: defaultModifier,
};

export const getDecimalPlaces = (multiplier: number): number => {
  if (multiplier >= 1) return 0;
  return Math.abs(Math.floor(Math.log10(multiplier)));
};

export const formatNumber = (value: number, decimals: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: Math.max(6, decimals),
    useGrouping: false,
  }).format(value);
};
