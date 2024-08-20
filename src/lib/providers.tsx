'use client';

/* Core */
import { type JSX } from 'react';
import { Provider } from 'react-redux';

/* Instruments */
import { reduxStore } from '@/lib/redux';

export const Providers = (props: React.PropsWithChildren): JSX.Element => {
  return <Provider store={reduxStore}>{props.children}</Provider>;
};
