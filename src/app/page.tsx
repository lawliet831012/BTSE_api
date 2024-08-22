/* Components */
import { type JSX } from 'react';
import { OrderBook } from '@/components/Orderbook';

import styles from './index.module.css';

export default function IndexPage(): JSX.Element {
  return (
    <main className={styles.container}>
      <OrderBook />
    </main>
  );
}

export const metadata = {
  title: 'crypto.com api',
};
