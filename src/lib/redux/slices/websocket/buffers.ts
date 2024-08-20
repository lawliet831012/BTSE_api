import { symbolList } from '@/config/symbols';
import type { OrderbookState } from '../orderbook';

export const orderBooksBuffer: OrderbookState = symbolList.reduce(
  (acc, symbol) => {
    acc[symbol] = {
      name: symbol,
      orderbook: {
        asks: [],
        bids: [],
      },
    };
    return acc;
  },
  {} as OrderbookState,
);
