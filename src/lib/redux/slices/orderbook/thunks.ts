import { orderBooksBuffer } from '../websocket/buffers';
import type { ReduxThunkAction } from '@/lib/redux';
import { orderbookSlice } from '@/lib/redux';
// import type { supportedSymbol } from '@/config/symbols';

export const updateOrderBook = (): ReduxThunkAction => (dispatch, getState) => {
  const snapshot = JSON.parse(JSON.stringify(orderBooksBuffer));

  for (const symbol in snapshot) {
    // const volumeList = [
    //   ...snapshot[symbol].orderbook.asks,
    //   ...snapshot[symbol].orderbook.bids,
    // ].map(([, volume]: number[]) => volume);
    // const max = Math.max(...volumeList);

    // snapshot[symbol].orderbook.asks = snapshot[symbol].orderbook.asks.map(
    //   ([price, volume]: number[]) => [
    //     price,
    //     volume,
    //     ((volume / max) * 100).toFixed(0),
    //   ],
    // );
    // snapshot[symbol].orderbook.bids = snapshot[symbol].orderbook.bids.map(
    //   ([price, volume]: number[]) => [
    //     price,
    //     volume,
    //     ((volume / max) * 100).toFixed(0),
    //   ],
    // );
    snapshot[symbol].orderbook = parseSymbolData(snapshot[symbol].orderbook);
  }

  dispatch(orderbookSlice.actions.updateOrderBook(snapshot));
};

export const parseSymbolData = (rawData: any): any => {
  const newData = JSON.parse(JSON.stringify(rawData));
  const volumeList = [...newData.asks, ...newData.bids].map(
    ([, volume]: number[]) => volume,
  );
  const max = Math.max(...volumeList);

  newData.asks = newData.asks.map(([price, volume]: number[]) => [
    price,
    volume,
    ((volume / max) * 100).toFixed(0),
  ]);
  newData.bids = newData.bids.map(([price, volume]: number[]) => [
    price,
    volume,
    ((volume / max) * 100).toFixed(0),
  ]);
  return newData;
};
