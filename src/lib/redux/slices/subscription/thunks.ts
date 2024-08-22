'use client';
import {
  // orderbookThunks,
  sendMessage,
  subscriptionSlice,
} from '@/lib/redux';
import type { ReduxThunkAction } from '@/lib/redux';
import { symbolGrouping, marketWs, orderbookWs } from '@/config/symbols';
import type { supportedSymbol } from '@/config/symbols';

let orderBookTimeout: number | null = null;

// const updateOrderBookByInterval =
//   (): ReduxThunkAction => (dispatch, getState) => {
//     orderBookTimeout = window.setTimeout(() => {
//       dispatch(orderbookThunks.updateOrderBook());
//       dispatch(updateOrderBookByInterval());
//     }, 500);
//   };

export const subscribeOrderBook =
  ({ symbols, inherit }: subscribeOrderBookPayload): ReduxThunkAction =>
  (dispatch, getState) => {
    const { orderBookSubscribeList } = getState().subscription;
    if (orderBookTimeout !== null) {
      clearTimeout(orderBookTimeout);
      orderBookTimeout = null;
    }
    if (inherit) {
      symbols = Array.from(new Set([...orderBookSubscribeList, ...symbols])); // Remove duplicate symbols
    }

    const channels: {
      update: string[];
      tradeHistoryApiV2: string[];
    } = {
      update: [],
      tradeHistoryApiV2: [],
    };

    symbols.forEach((symbol) => {
      channels.update.push(`update:${symbol}_${symbolGrouping}`);
      channels.tradeHistoryApiV2.push(`tradeHistoryApiV2:${symbol}`);
    });

    sendMessage(
      marketWs,
      {
        op: 'subscribe',
        args: channels.tradeHistoryApiV2,
      },
      true,
    );
    sendMessage(
      orderbookWs,
      {
        op: 'subscribe',
        args: channels.update,
      },
      true,
    );

    // dispatch(orderbookThunks.updateOrderBook());
    // dispatch(updateOrderBookByInterval());

    dispatch(subscriptionSlice.actions.setOrderBookSubscribeList(symbols));
  };

export const reSubscribeOrderBook =
  ({ symbol }: { symbol: supportedSymbol }): ReduxThunkAction =>
  (dispatch, getState) => {
    const args = [`update:${symbol}_${symbolGrouping}`];
    sendMessage(orderbookWs, {
      op: 'unsubscribe',
      args,
    });
    sendMessage(orderbookWs, {
      op: 'subscribe',
      args,
    });
  };

export type subscribeOrderBookPayload = {
  symbols: supportedSymbol[];
  inherit: boolean;
};
