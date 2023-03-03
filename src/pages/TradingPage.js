import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
// material
import { Container, Box, Stack } from '@material-ui/core';

// components
// eslint-disable-next-line import/no-unresolved
import datafeed from 'src/components/_external-pages/trading/chart/datafeed';
import Page from '../components/Page';

import { Chart, ChartStatus, LongShort, TradesBoard } from '../components/_external-pages/trading';
// import { LongShort, TradesBoard } from '../components/_external-pages/trading';

const ENDPOINT = process.env.REACT_APP_WS_API_URL;
const socket = io(`${ENDPOINT}`);
// ----------------------------------------------------------------------

export default function TradingPage() {
  const theme = useTheme();
  const [currency, setCurrency] = useState('btc');
  const [interval, setInterval] = useState('1 min');
  const [cType, setCType] = useState(0);
  const [chartViewMode, setChartViewMode] = useState(1);
  const [lastPrice, setLastPrice] = useState({});
  const [lastOHLCData, setLastOHLCData] = useState({});

  useEffect(() => {
    chartInitailize();
  }, []);
  const chartInitailize = async () => {
    const widget = new TradingView.widget({
      debug: true,
      symbol: 'Cryptos:BTC/USD', // default symbol
      interval: '1', // default interval
      fullscreen: true, // displays the chart in the fullscreen mode
      container: 'tv_chart_container',
      datafeed,
      library_path: 'charting_library/charting_library/',
      theme: 'Dark',
      allButtonsEnabled: true
    });
    // //console.log(widget);
    // widget.activeChart().setResolution('1');
    // window.tvWidget = widget;
  };
  return (
    <Page title="Trading | APED">
      <Container maxWidth="xl" m={1} sx={{ mb: 10, mt: 10, [theme.breakpoints.up('md')]: { mt: 1 } }}>
        <Box m={{ xs: 1, md: 4 }} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Stack spacing={1} direction="column" sx={{ width: '100%' }}>
            {/* <ChartStatus
              lastPrice={lastPrice}
              chartViewMode={chartViewMode}
              currency={currency}
              lastOHLCData={lastOHLCData}
              onChartCurrency={(cur) => setCurrency(cur)}
              onChartInterval={(int) => setInterval(int)}
              onCType={(ctype) => setCType(ctype)}
              socket={socket}
            /> */}
            <Box sx={{ width: '100%', height: '100%' }} id="tv_chart_container">
              {/* <Chart
                currency={currency}
                interval={interval}
                ctype={cType}
                chartViewMode={1}
                onSetLastPrice={(price) => setLastPrice(price)}
                onSetLastOHLCData={(ohlc) => setLastOHLCData(ohlc)}
                socket={socket}
              /> */}
            </Box>
          </Stack>
          <LongShort currency={currency} ctype={cType} onChartViewMode={(vm) => setChartViewMode(vm)} socket={socket} />
        </Stack>
        <Box m={3} />
        <TradesBoard />
      </Container>
    </Page>
  );
}
