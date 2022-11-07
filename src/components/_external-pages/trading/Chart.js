import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';

Chart.propTypes = {
  currency: PropTypes.string,
  chartViewMode: PropTypes.number
};

export default function Chart({ currency, chartViewMode }) {
  const chartContainerRef = useRef(null);
  const chart = useRef(null);
  const resizeObserver = useRef();

  const candleSeriesRef = useRef();

  const [priceData, setPriceData] = useState([]);

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

  useEffect(() => {
    const { candleStickData, baseLineData } = processingData(priceData);
    if (chart.current) {
      if (chartViewMode) {
        candleSeriesRef.current.setData(candleStickData);
      } else {
        candleSeriesRef.current.setData(baseLineData);
      }
      chart.current.timeScale().fitContent();
    }
  }, [priceData, chartViewMode]);

  // Resize chart on container resizes.

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  useEffect(() => {
    fetchData(currency);
  }, [currency]);

  const fetchData = (curr) => {
    try {
      fetch(`${process.env.REACT_APP_CHART_API_URL}/ohcl/crypto/${curr}/1min`)
        .then((response) => response.json())
        .then((data) => setPriceData(data));
    } catch (e) {
      console.log(e);
    }
  };

  return <div ref={chartContainerRef} className="chart-container" style={{ height: '100%' }} />;
}

function processingData(chartArr) {
  // const timeStamp = 1667778600000;
  // const dateFormat = new Date(timeStamp);
  // console.log(
  //   `'Date: ${dateFormat.getDate()}/${
  //     dateFormat.getMonth() + 1
  //   }/${dateFormat.getFullYear()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}:${dateFormat.getSeconds()}`
  // );

  chartArr.reverse();
  const candleStickData = [];
  const baseLineData = [];
  chartArr.map((tdate) => {
    baseLineData.push({
      time: new Date(tdate.time).getTime() / 1000,
      value: Number(tdate.high)
    });
    candleStickData.push({
      time: new Date(tdate.time).getTime() / 1000,
      open: Number(tdate.open),
      close: Number(tdate.close),
      high: Number(tdate.high),
      low: Number(tdate.low),
      volume: tdate.volume
    });

    return 0;
  });
  return { baseLineData, candleStickData };
}
