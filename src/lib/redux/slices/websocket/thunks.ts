/* Instruments */
import {
  sendMessage,
  orderbookSlice,
  chartThunks,
  chartSlice,
  orderbookThunks,
} from '@/lib/redux';
import type {
  ReduxThunkAction,
  messageType,
  OrderbookData,
  RawData,
} from '@/lib/redux';
import type { supportedSymbol } from '@/config/symbols';
// import { orderBooksBuffer } from './buffers';

export const messageParser: Record<
  string,
  (name: string, message: messageType) => ReduxThunkAction
> = {
  'public/heartbeat': (name, messge) => (dispatch, getState) => {
    const { id } = messge;
    sendMessage(name, { id, method: 'public/respond-heartbeat' });
  },
  subscribe: (name, messge) => (dispatch, getState) => {
    const { result = {} } = messge;
    const { channel, data, instrument_name: instrumentName } = result;
    if (channel in subscribeParser) {
      dispatch(subscribeParser[channel](instrumentName, data));
    }
  },
};

export const subscribeParser: Record<
  string,
  (
    symbol: supportedSymbol,
    data: Array<OrderbookData | RawData>,
  ) => ReduxThunkAction
> = {
  book: (symbol, data) => (dispatch, getState) => {
    // orderBooksBuffer[symbol].orderbook = data[0] as OrderbookData;
    dispatch(
      orderbookSlice.actions.updateOrderBookBySymbol({
        symbol,
        data: orderbookThunks.parseSymbolData(data[0]) as OrderbookData,
      }),
    );
  },
  candlestick: (symbol, data) => (dispatch, getState) => {
    if (data.length === 1) {
      dispatch(chartThunks.updateBar(symbol, data[0] as RawData));
    } else {
      dispatch(
        chartSlice.actions.updateHistory({
          symbol,
          data: data as RawData[],
        }),
      );
    }
  },
};
