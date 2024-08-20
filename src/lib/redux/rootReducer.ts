/* Instruments */
import {
  coreSlice,
  websocketSlice,
  subscriptionSlice,
  orderbookSlice,
} from './slices';

export const reducer = {
  core: coreSlice.reducer,
  websocket: websocketSlice.reducer,
  subscription: subscriptionSlice.reducer,
  orderbook: orderbookSlice.reducer,
};
