/* Instruments */
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';
import { websocketSlice } from '@/lib/redux';
import { marketWs, orderbookWs } from '@/config/symbols';

export const initailizeAsync = createAppAsyncThunk(
  'core/initailizeClient',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      dispatch(
        websocketSlice.actions.connect({
          name: marketWs,
          url: `${process.env.NEXT_PUBLIC_API_URL}/futures`,
        }),
      );

      dispatch(
        websocketSlice.actions.connect({
          name: orderbookWs,
          url: `${process.env.NEXT_PUBLIC_API_URL}/oss/futures`,
        }),
      );

      return 'fulfilled';
    } catch (error) {
      console.error(error);
      return 'failed';
    }
  },
);
