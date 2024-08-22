import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type supportedSymbol, symbolList } from '@/config/symbols';

const initialState: OrderbookState = symbolList.reduce((acc, symbol) => {
  acc[symbol] = {
    name: symbol,
    orderbook: {
      asks: [],
      bids: [],
      prevAsks: undefined,
      prevBids: undefined,
      seqNum: undefined,
    },
    quote: {
      price: undefined,
      trend: undefined,
    },
  };
  return acc;
}, {} as OrderbookState);

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    updateQuote: (
      state,
      action: PayloadAction<{ symbol: supportedSymbol; quote: quote }>,
    ) => {
      state[action.payload.symbol].quote = action.payload.quote;
    },
    updateOrderBook: (state, action: PayloadAction<OrderbookState>) => {
      for (const symbol in action.payload) {
        state[symbol as supportedSymbol].orderbook =
          action.payload[symbol as supportedSymbol].orderbook;
      }
    },
    updateOrderBookBySymbol: (
      state,
      action: PayloadAction<{ symbol: supportedSymbol; data: OrderbookData }>,
    ) => {
      const { symbol, data } = action.payload;
      state[symbol].orderbook = data;
    },
  },
});

export type OrderbookState = Record<supportedSymbol, SymbolDetail>;

export type SymbolDetail = {
  name: supportedSymbol;
  orderbook: OrderbookData;
  quote: quote;
};

export type quote = {
  price: number | undefined;
  trend: 'up' | 'down' | undefined;
};

export type OrderbookData = {
  bids: Array<[string, string]>;
  asks: Array<[string, string]>;
  prevAsks?: Record<string, string>;
  prevBids?: Record<string, string>;
  seqNum: number | undefined;
};
