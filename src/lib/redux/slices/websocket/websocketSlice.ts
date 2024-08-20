/* Core */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { messageParser } from './thunks';
import { reduxStore } from '@/lib/redux';

const wssMap: Record<string, any> = {};
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

      wssMap[name] = wss;
      state.connection = {
        ...state.connection,
        [name]: { url, name },
      };
    },
    disconnect: (state, action: PayloadAction<string>) => {
      wssMap[action.payload].close();
      delete wssMap[action.payload];
      const { [action.payload]: _, ...rest } = state.connection;
      state.connection = rest;
    },
  },
  extraReducers: (builder) => {},
});

export function sendMessage(name: string, payload: Record<string, any>): void {
  if (name in wssMap) {
    wssMap[name].send(JSON.stringify(payload));
  } else {
    if (!(name in messageQueue)) {
      messageQueue[name] = [];
    }
    messageQueue[name].push({ name, payload });
  }
}

const createEventHandler = (
  name: string,
): Record<string, (enent: MessageEvent<string>) => void> => {
  return {
    onOpen: (event) => {
      console.info(name, ': Wss Open');
      if (name in messageQueue) {
        messageQueue[name].forEach((send) => {
          sendMessage(send.name, send.payload);
        });
        messageQueue[name] = [];
      }
    },
    onClose: (event) => {
      console.info(name, ': Wss Close');
    },
    onMessage: (event) => {
      const { method }: messageType = JSON.parse(event.data);
      if (method in messageParser) {
        reduxStore.dispatch(
          messageParser[method](name, JSON.parse(event.data) as messageType),
        );
      }
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
  name: string;
  url: string;
};

export type messageType = {
  id: number;
  code?: number;
  method: string;
  result?: Record<string, any>;
};

export type sendMessageType = {
  name: string;
  payload: Record<string, any>;
};
