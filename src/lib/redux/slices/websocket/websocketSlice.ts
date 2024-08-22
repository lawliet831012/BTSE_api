/* Core */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { messageResolver } from './thunks';
import type { wsName } from '@/config/symbols';
// import { reduxStore } from '@/lib/redux';

const wssMap: Record<
  string,
  { wss: any; initailMessage: sendMessageType[]; restart: boolean }
> = {};
const messageQueue: Record<string, sendMessageType[]> = {};

const initialState: websocketState = {
  connection: {},
};

function initialWebSocket(url: string, protocols = [], options = {}): any {
  const wss = new ReconnectingWebSocket(`wss://${url}`, protocols, {
    ...options,
    minReconnectionDelay: 3000,
    connectionTimeout: 3000,
    minUptime: 3000,
  });
  return wss;
}

export const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<websocketOption>) => {
      const { url, name } = action.payload;

      const wss = initialWebSocket(url);
      const { onOpen, onClose, onMessage, onError } = createEventHandler(name);

      wss.onopen = onOpen;
      wss.onclose = onClose;
      wss.onmessage = onMessage;
      wss.onerror = onError;

      wssMap[name] = {
        wss,
        initailMessage: [],
        restart: false,
      };
      state.connection = {
        ...state.connection,
        [name]: { url, name },
      };
    },
    disconnect: (state, action: PayloadAction<string>) => {
      wssMap[action.payload].wss.close();
      delete wssMap[action.payload];
      const { [action.payload]: _, ...rest } = state.connection;
      state.connection = rest;
    },
  },
  extraReducers: (builder) => {},
});

export function sendMessage(
  name: string,
  payload: Record<string, any>,
  initail: boolean = false,
): void {
  if (name in wssMap) {
    wssMap[name].wss.send(JSON.stringify(payload));
    initail && wssMap[name].initailMessage.push({ name, payload });
  } else {
    if (!(name in messageQueue)) {
      messageQueue[name] = [];
    }
    messageQueue[name].push({ name, payload, initail });
  }
}

const createEventHandler = (
  name: wsName,
): Record<string, (enent: MessageEvent<string>) => void> => {
  return {
    onOpen: (event) => {
      console.info(name, ': Wss Open');
      if (name in messageQueue) {
        messageQueue[name].forEach((send) => {
          sendMessage(send.name, send.payload, send.initail);
        });
        messageQueue[name] = [];
      }
      if (wssMap[name].restart) {
        wssMap[name].initailMessage.forEach((send) => {
          sendMessage(send.name, send.payload);
        });
        wssMap[name].restart = false;
      }
    },
    onClose: (event) => {
      console.info(name, ': Wss Close');
      wssMap[name].restart = true;
    },
    onMessage: (event) => {
      messageResolver[name](JSON.parse(event.data) as messageType);
    },
    onError: (event) => {
      console.info(name, ': Wss Error');
      console.error(event);
    },
  };
};

/* Types */
export type websocketState = {
  connection: Record<string, Record<string, string>>;
};

export type websocketOption = {
  name: wsName;
  url: string;
};

export type messageType = {
  data: any;
  topic: string;
};

export type sendMessageType = {
  name: string;
  payload: Record<string, any>;
  initail?: boolean;
};

export type OrderBookMEssage = {
  type: string;
  asks: Array<[string, string]>;
  bids: Array<[string, string]>;
  prevSeqNum: number;
  seqNum: number;
  timestamp: number;
  symbol: string;
};
