export const symbolList = [
  'BTCUSD-PERP',
  'ETHUSD-PERP',
  'SOL_USD',
  'XRP_USD',
  'ADA_USD',
  'MATIC_USD',
] as const;
export type supportedSymbol = (typeof symbolList)[number];

export const periodList = [
  '1m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '12h',
  '1D',
  '7D',
  '14D',
  '1M',
] as const;

export type supportedPeriod = (typeof periodList)[number];

export const orderbookDepth = 10;
