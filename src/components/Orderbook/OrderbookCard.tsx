'use client';
import { useMemo } from 'react';
import type { JSX } from 'react';
import { orderbookDepth } from '@/config/symbols';
import type { supportedSymbol } from '@/config/symbols';
import { useSelector } from '@/lib/redux';
import ArrowDown from './ArrowDown.icon';
import styles from './orderbook.module.css';
import { numberWuthCommas } from '@/lib/utils';

const bidSkeleton = Array.from({ length: orderbookDepth }, () => '--').map(
  (_, index) => (
    <div key={`bid-skeleton-${index}`} className={styles.skeleton} />
  ),
);
const askSkeleton = Array.from({ length: orderbookDepth }, () => '--').map(
  (_, index) => (
    <div key={`ask-skeleton-${index}`} className={styles.skeleton} />
  ),
);

const OrderBookCard = ({
  symbol,
}: {
  symbol: supportedSymbol;
}): JSX.Element => {
  const orderBook = useSelector((state) => state.orderbook[symbol].orderbook);

  const asks = useMemo(() => {
    const showedAsks = orderBook.asks.slice(orderbookDepth * -1).reverse();
    let sum = 0;
    return showedAsks.map((ask) => [...ask, (sum += Number(ask[1]))]).reverse();
  }, [orderBook.asks]);
  const bids = useMemo(() => {
    const showedBids = orderBook.bids.slice(0, orderbookDepth);
    let sum = 0;
    return showedBids.map((bid) => [...bid, (sum += Number(bid[1]))]);
  }, [orderBook.bids]);
  const quote = useSelector((state) => state.orderbook[symbol].quote);

  const prieTrendClass =
    quote.trend === undefined
      ? styles.nutral
      : quote.trend === 'up'
        ? styles.up
        : styles.down;

  return (
    <section className={styles.cards}>
      <h1 className={styles.title}>Order Book</h1>
      <div>
        <div className={styles.header}>
          <span className={styles.rowCell}>{'Price(USD)'}</span>
          <span className={styles.rowCell}>Size</span>
          <span className={styles.rowCell}>Total</span>
        </div>
        {asks.length === 0
          ? askSkeleton
          : asks.map((ask, index) => {
              const totalPercentage = (
                (Number(ask[2]) / Number(asks[0][2])) *
                100
              ).toFixed(0);

              const existInPrev = Boolean(orderBook?.prevAsks?.[ask[0]]);

              let sizeFlashClass = '';
              if (existInPrev) {
                if (Number(orderBook?.prevAsks?.[ask[0]]) !== Number(ask[1])) {
                  sizeFlashClass =
                    Number(orderBook?.prevAsks?.[ask[0]]) > Number(ask[1])
                      ? styles.flashRed
                      : styles.flashGreen;
                }
              }
              return (
                <div
                  key={`${symbol}-ask-${ask[0]}${ask[1]}`}
                  className={`${styles.row} ${existInPrev ? '' : styles.flashGreen}`}
                >
                  <span
                    className={`${styles.rowCell} ${styles.rowPrice} ${styles.ask}`}
                  >
                    {numberWuthCommas(ask[0])}
                  </span>
                  <span
                    className={`${styles.rowCell} ${styles.rowSize} ${sizeFlashClass}`}
                  >
                    {numberWuthCommas(ask[1])}
                  </span>
                  <span className={`${styles.rowCell} ${styles.rowSum}`}>
                    {numberWuthCommas(ask[2])}
                    <div
                      className={styles.askBar}
                      style={{ width: `${totalPercentage}%` }}
                    />
                  </span>
                </div>
              );
            })}

        <div className={`${styles.priceContainer} ${prieTrendClass}`}>
          {quote.price === undefined ? (
            <div className={styles.skeleton} />
          ) : (
            <span className={styles.price}>
              {numberWuthCommas(quote.price)}
              <span
                className={styles.priceTrend}
                style={{
                  transform: `rotate(${quote.trend === 'up' ? 180 : 0}deg)`,
                }}
              >
                {quote.trend !== undefined && (
                  <ArrowDown width={16} height={16} />
                )}
              </span>
            </span>
          )}
        </div>

        {bids.length === 0
          ? bidSkeleton
          : bids.map((bid, index) => {
              const totalPercentage = (
                (Number(bid[2]) / Number(bids[orderbookDepth - 1][2])) *
                100
              ).toFixed(0);

              const existInPrev = Boolean(orderBook?.prevBids?.[bid[0]]);

              let sizeFlashClass = '';
              if (existInPrev) {
                if (Number(orderBook?.prevBids?.[bid[0]]) !== Number(bid[1])) {
                  sizeFlashClass =
                    Number(orderBook?.prevBids?.[bid[0]]) > Number(bid[1])
                      ? styles.flashRed
                      : styles.flashGreen;
                }
              }
              return (
                <div
                  key={`${symbol}-bid-${bid[0]}${bid[1]}`}
                  className={`${styles.row} ${existInPrev ? '' : styles.flashRed}`}
                >
                  <span
                    className={`${styles.rowCell} ${styles.rowPrice} ${styles.bid}`}
                  >
                    {numberWuthCommas(bid[0])}
                  </span>
                  <span
                    className={`${styles.rowCell} ${styles.rowSize} ${sizeFlashClass}`}
                  >
                    {numberWuthCommas(bid[1])}
                  </span>
                  <span className={`${styles.rowCell} ${styles.rowSum}`}>
                    {numberWuthCommas(bid[2])}
                    <div
                      className={styles.bidBar}
                      style={{
                        width: `${totalPercentage}%`,
                      }}
                    />
                  </span>
                </div>
              );
            })}
      </div>
    </section>
  );
};

export default OrderBookCard;
