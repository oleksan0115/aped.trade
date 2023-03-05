import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
// material
import { Container, Box, Stack } from '@material-ui/core';

// components
// eslint-disable-next-line import/no-unresolved
import datafeed from 'src/components/_external-pages/trading/chart/datafeed';
import { PriceTypes } from '../components/_external-pages/trading/chart/Consts';
import Page from '../components/Page';

import { ChartStatus, LongShort, TradesBoard } from '../components/_external-pages/trading';

// import { LongShort, TradesBoard } from '../components/_external-pages/trading';

const ENDPOINT = process.env.REACT_APP_WS_API_URL;
const socket = io(`${ENDPOINT}`);
// ----------------------------------------------------------------------

export default function TradingPage() {
  const theme = useTheme();
  const [currency, setCurrency] = useState('btc');
  const [interval, setInterval] = useState('1');
  const [cType, setCType] = useState(0);
  const [chartViewMode, setChartViewMode] = useState(1);
  const [lastPrice, setLastPrice] = useState({});
  const [lastOHLCData, setLastOHLCData] = useState({});
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    chartInitailize();
  }, []);
  const chartInitailize = async () => {
    const chart = new TradingView.widget({
      debug: true,
      symbol: 'Crypto:BTC/USD', // default symbol
      interval: '1', // default interval
      fullscreen: true, // displays the chart in the fullscreen mode
      container: 'tv_chart_container',
      datafeed,
      library_path: 'charting_library/charting_library/',
      theme: 'Dark',
      allButtonsEnabled: true
    });
    chart.onChartReady(() => {
      chart
        .activeChart()
        .onSymbolChanged()
        .subscribe(null, (data) => {
          const type = PriceTypes.indexOf(data.exchange);
          let cur;
          if (type !== 2) cur = data.name.split('/')[0].toLowerCase();
          else cur = data.name.toLowerCase();
          setCurrency(cur);
          setCType(type);
        });
      chart
        .activeChart()
        .onIntervalChanged()
        .subscribe(null, (data) => {
          console.log('The interval is changed', data);
          setInterval(data);
        });
    });
    setWidget(chart);
  };
  return (
    <Page title="Trading | APED">
      <Container maxWidth="xl" m={1} sx={{ mb: 10, mt: 10, [theme.breakpoints.up('md')]: { mt: 1 } }}>
        <Box m={{ xs: 1, md: 4 }} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Stack spacing={1} direction="column" sx={{ width: '100%' }}>
            <ChartStatus
              lastPrice={lastPrice}
              chartViewMode={chartViewMode}
              currency={currency}
              ctype={cType}
              interval={interval}
              lastOHLCData={lastOHLCData}
              onChartCurrency={(cur, type) => {
                console.log('currency: ', cur);
                console.log('cType : ', type);
                setCurrency(cur);
                setCType(type);
                const priceType = PriceTypes[type];
                console.log(widget.symbolInterval());
                if (type !== 2)
                  widget.setSymbol(`${priceType}:${cur.toUpperCase()}/USD`, interval, () => {
                    console.log(112212);
                  });
                else
                  widget.setSymbol(`${priceType}:${cur.toUpperCase()}`, interval, () => {
                    console.log(112212);
                  });
              }}
              onChartInterval={(_interval) => {
                setInterval(_interval);
                // widget.setInterval
                widget.activeChart().setResolution(_interval);
              }}
              socket={socket}
            />
            <Box sx={{ width: '100%', height: '100%' }} id="tv_chart_container" />
          </Stack>
          <LongShort currency={currency} ctype={cType} onChartViewMode={(vm) => setChartViewMode(vm)} socket={socket} />
        </Stack>
        <Box m={3} />
        <TradesBoard />
      </Container>
    </Page>
  );
}
