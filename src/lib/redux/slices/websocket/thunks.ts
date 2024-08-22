/* Instruments */
import { reduxStore } from '@/lib/redux';
import type { messageType } from '@/lib/redux';
import { marketWs, orderbookWs } from '@/config/symbols';
import { messageParser } from '../orderbook/thunks';

export const messageResolver: {
  [marketWs]: (message: messageType) => void;
  [orderbookWs]: (message: messageType) => void;
} = {
  [marketWs]: (message: messageType) => {
    const { data, topic } = message;
    if (topic in messageParser[marketWs]) {
      reduxStore.dispatch(messageParser[marketWs][topic](data));
    }
  },
  [orderbookWs]: (message: messageType) => {
    const { data } = message;

    if (data?.type in messageParser[orderbookWs]) {
      reduxStore.dispatch(messageParser[orderbookWs][data.type](data));
    }
  },
};
