/* eslint-disable */
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';

import { getPreviousChartData } from './api';

Chart.propTypes = {
  currency: PropTypes.string,
  interval: PropTypes.number,
  ctype: PropTypes.number,
  chartViewMode: PropTypes.number,
  onSetLastPrice: PropTypes.func,
  socket: PropTypes.object
};

export default function Chart({ currency, interval, ctype, chartViewMode, onSetLastPrice, socket }) {
  const chartContainerRef = useRef(null);
  const chart = useRef(null);
  const resizeObserver = useRef();

  const candleSeriesRef = useRef();

  useEffect(() => {
    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        layout: {
          backgroundColor: '#0D0C17',
          textColor: 'rgba(255, 255, 255, 0.9)'
        },
        grid: {
          vertLines: {
            color: '#0D0C17'
          },
          horzLines: {
            color: '#0D0C17'
          }
        },
        crosshair: {
          mode: CrosshairMode.Normal
        },
        priceScale: {
          borderColor: '#485c7b'
        },
        timeScale: {
          timeVisible: true,
          borderColor: '#485c7b'
        }
      });
    }

    if (chartViewMode) {
      candleSeriesRef.current = chart.current.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1'
      });
    } else {
      candleSeriesRef.current = chart.current.addBaselineSeries();
    }
  }, [chartViewMode]);

  // Resize chart on container resizes.

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  useEffect(() => {
    processingData();
    let formattedData = [];
    let lastOHLCData = {};
    const lastTime = Date.now();
    const startTime = lastTime - 3 * 24 * 60 * 60 * 1000;
    let pairString = '';

    if (PriceTypes[ctype] === 'crypto') pairString = `${currency.toUpperCase()}-USD`;
    else if (PriceTypes[ctype] === 'forex') pairString = `${currency.toUpperCase()}/USD`;
    else pairString = `${currency.toUpperCase()}`;

    getPreviousChartData(currency, interval, PriceTypes[ctype], startTime, lastTime).then((pastData) => {
      if (pastData) {
        formattedData = pastData.map((d) => {
          const currentDate = new Date();
          const mil = currentDate.getTimezoneOffset();
          const time = new Date(d.t).getTime() / 1000 - mil * 60;

          lastOHLCData = {
            close: d.c,
            high: d.h,
            low: d.l,
            open: d.o,
            time
          };
          return lastOHLCData;
        });
        candleSeriesRef.current.setData(formattedData);
        onSetLastPrice({ ...lastOHLCData, currency });
      }
    });

    const tradingHandler = (t) => {
      let closePrice = 0;
      let pair = '';
      // console.log(t, pairString);
      if (PriceTypes[ctype] === 'crypto') {
        closePrice = t.p;
        pair = t.pair;
      } else if (PriceTypes[ctype] === 'forex') {
        closePrice = t.a;
        pair = t.p;
      } else {
        closePrice = (t.ap + t.bp) / 2;
        pair = t.sym;
      }
      try {
        const data = {
          close: closePrice,
          high: lastOHLCData.high,
          low: lastOHLCData.low,
          open: lastOHLCData.open,
          time: lastOHLCData.time
        };
        if (pair === pairString) candleSeriesRef.current.update(data);
      } catch (e) {
        /* Error hanlding codes */
      }
    };

    const ohlcHandler = (t) => {
      try {
        const currentDate = new Date();
        const mil = currentDate.getTimezoneOffset();
        const time = new Date(t.s).getTime() / 1000 - mil * 60;

        if (t.pair === pairString) {
          lastOHLCData = {
            close: t.c,
            high: t.h,
            low: t.l,
            open: t.o,
            time
          };
        }
      } catch (e) {
        /* Error hanlding codes */
      }
    };

    socket.on(`${PriceTypes[ctype]}_trade_data`, tradingHandler);

    socket.on(`${PriceTypes[ctype]}_ohlc_data`, ohlcHandler);

    return () => {
      socket.off(`${PriceTypes[ctype]}_trade_data`, tradingHandler);
      socket.off(`${PriceTypes[ctype]}_ohlc_data`, ohlcHandler);
    };
  }, [currency, ctype, interval]);

  return <div ref={chartContainerRef} className="chart-container" />;
}

function processingData() {
  const timeStamp = 1669596714453;
  const dateFormat = new Date(timeStamp);
  console.log(
    `'Date: ${dateFormat.getDate()}/${
      dateFormat.getMonth() + 1
    }/${dateFormat.getFullYear()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}:${dateFormat.getSeconds()}`
  );
}

const PriceTypes = ['crypto', 'forex', 'stocks'];
