/* Instruments */
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';
import { websocketSlice } from '@/lib/redux';

export const initailizeAsync = createAppAsyncThunk(
  'core/initailizeClient',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      dispatch(
        websocketSlice.actions.connect({
          name: 'CRYPTO_COM_MARKET_WSS',
          url: `${process.env.NEXT_PUBLIC_STREAM_URL}/v1/market`,
        }),
      );

      return 'fulfilled';
    } catch (error) {
      console.error(error);
      return 'failed';
    }
  },
);
