/* Components */
import { type JSX } from 'react';
import { OrderBook } from '@/components/Orderbook';
import { Chart } from '@/components/Chart';

import styles from './index.module.css';

export default function IndexPage(): JSX.Element {
  return (
    <main className={styles.container}>
      <Chart />
      <OrderBook />
    </main>
  );
}

export const metadata = {
  title: 'crypto.com api',
};
