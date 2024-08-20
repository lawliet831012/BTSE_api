'use client';
import type { JSX } from 'react';
import type { supportedSymbol } from '@/config/symbols';
import { useSelector } from '@/lib/redux';

import styles from './orderbook.module.css';

const OrderBookCard = ({
  symbol,
}: {
  symbol: supportedSymbol;
}): JSX.Element => {
  const orderBook = useSelector((state) => state.orderbook[symbol].orderbook);
  return (
    <section className={styles.cards}>
      <h1>{symbol}</h1>
      <div className={styles.reverseContainer}>
        {orderBook.bids.map((bid, index) => (
          <div
            key={`${symbol}-bid-${bid[0]}${bid[1]}`}
            className={`${styles.row} ${styles.bid}`}
          >
            <div className={styles.bidBar} style={{ width: `${bid[2]}%` }} />
            <span>{bid[0]}</span>
            <span>{bid[1]}</span>
          </div>
        ))}
        {orderBook.asks.map((ask, index) => (
          <div
            key={`${symbol}-ask-${ask[0]}${ask[1]}`}
            className={`${styles.row} ${styles.ask}`}
          >
            <div className={styles.askBar} style={{ width: `${ask[2]}%` }} />
            <span>{ask[0]}</span>
            <span>{ask[1]}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderBookCard;
