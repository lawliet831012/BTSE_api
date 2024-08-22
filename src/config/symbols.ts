export const symbolList = ['BTCPFC'] as const;
export type supportedSymbol = (typeof symbolList)[number];

export const symbolGrouping = 0;
export const orderbookDepth = 8;

export const marketWs = 'BTSE_MARKET_WSS' as const;
export const orderbookWs = 'BTSE__ORDERBOOK_WSS' as const;
export type marketWsType = typeof marketWs;
export type orderbookWsType = typeof orderbookWs;
export type wsName = [marketWsType, orderbookWsType][number];

export const priceSymbolMap: Record<string, supportedSymbol> = {
  'BTC-PERP': 'BTCPFC',
};
