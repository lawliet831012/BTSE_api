'use client';
import { useEffect } from 'react';
import type { JSX } from 'react';
import { useDispatch, subscriptionThunks } from '@/lib/redux';
import { symbolList } from '@/config/symbols';
import OrderBookCard from './OrderbookCard';

import styles from './orderbook.module.css';

const OrderBook = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      subscriptionThunks.subscribeOrderBook({
        symbols: [...symbolList],
        inherit: false,
      }),
    );
  }, []);

  return (
    <section className={styles.container}>
      {symbolList.map((symbol) => (
        <OrderBookCard key={`${symbol}-orderbook-card`} symbol={symbol} />
      ))}
    </section>
  );
};

export default OrderBook;
