// import { orderBooksBuffer } from '../websocket/buffers';
import { orderbookSlice, subscriptionThunks } from '@/lib/redux';
import type {
  // sendMessage,
  ReduxThunkAction,
  OrderbookData,
  OrderBookMEssage,
} from '@/lib/redux';
import {
  marketWs,
  orderbookWs,
  priceSymbolMap,
  // orderbookDepth,
} from '@/config/symbols';
import type { supportedSymbol, wsName } from '@/config/symbols';

export const messageParser: Record<
  wsName,
  Record<string, (data: any) => ReduxThunkAction>
> = {
  [marketWs]: {
    tradeHistoryApiV2:
      (data: Array<{ symbol: string; price: number }>) =>
      (dispatch, getState) => {
        const { price, symbol } = data[0];
        const mappedSymbol = priceSymbolMap[symbol] as supportedSymbol;
        const lastPrice =
          data[1] !== undefined
            ? data[1].price
            : getState().orderbook[mappedSymbol].quote.price;

        dispatch(
          orderbookSlice.actions.updateQuote({
            symbol: mappedSymbol,
            quote: {
              price,
              trend:
                lastPrice !== undefined
                  ? lastPrice > price
                    ? 'down'
                    : 'up'
                  : undefined,
            },
          }),
        );
      },
  },
  [orderbookWs]: {
    delta: (data: OrderBookMEssage) => (dispatch, getState) => {
      const { symbol, asks, bids, seqNum, prevSeqNum } = data;
      const lastOrderbook =
        getState().orderbook[symbol as supportedSymbol].orderbook;
      if (prevSeqNum !== lastOrderbook.seqNum) {
        console.log('seqNum not match');
        dispatch(
          subscriptionThunks.reSubscribeOrderBook({
            symbol: symbol as supportedSymbol,
          }),
        );
      }
      const newAsks = updateOrderbook(lastOrderbook.asks, asks);
      const newBids = updateOrderbook(lastOrderbook.bids, bids);
      const prevAsks: Record<string, string> = {};
      const prevBids: Record<string, string> = {};
      lastOrderbook.asks.forEach(
        ([price, volume]) => (prevAsks[price] = volume),
      );
      lastOrderbook.bids.forEach(
        ([price, volume]) => (prevBids[price] = volume),
      );

      const orderbookData: OrderbookData = {
        asks: newAsks,
        bids: newBids,
        prevAsks,
        prevBids,
        seqNum,
      };

      dispatch(
        orderbookSlice.actions.updateOrderBookBySymbol({
          symbol: symbol as supportedSymbol,
          data: orderbookData,
        }),
      );
    },
    snapshot: (data: OrderBookMEssage) => (dispatch, getState) => {
      const { symbol, asks, bids, seqNum } = data;
      // console.log(asks, bids);

      const orderbookData: OrderbookData = {
        asks,
        bids,
        prevAsks: undefined,
        prevBids: undefined,
        seqNum,
      };
      dispatch(
        orderbookSlice.actions.updateOrderBookBySymbol({
          symbol: symbol as supportedSymbol,
          data: orderbookData,
        }),
      );
    },
  },
};

const updateOrderbook = (
  prevArray: Array<[string, string]>,
  newArray: Array<[string, string]>,
): Array<[string, string]> => {
  if (newArray.length === 0) {
    return prevArray;
  }
  const updatedArray = [...prevArray];
  for (const [price, volume] of newArray) {
    const { index, replace } = sortedIndex(updatedArray, [price, volume]);

    if (replace) {
      if (volume === '0') {
        updatedArray.splice(index, 1); // remove if volume is 0
      } else {
        updatedArray[index] = [price, volume]; // replace if volume is not 0
      }
    } else {
      updatedArray.splice(index, 0, [price, volume]); // insert if not exist
    }
  }
  return updatedArray;
};

const sortedIndex = (
  array: Array<[string, string]>,
  value: [string, string],
): { index: number; replace: boolean } => {
  let low = 0;
  let high = array.length;

  while (low < high) {
    const mid = (low + high) >>> 1;
    if (Number(array[mid][0]) > Number(value[0])) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  const replace = array[low]?.[0] === value[0];
  return { index: low, replace };
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
