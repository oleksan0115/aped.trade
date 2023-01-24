import { io } from 'socket.io-client';
import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
// material
import { Container, Box, Stack } from '@material-ui/core';

// components
import Page from '../components/Page';

import { Chart, ChartStatus, LongShort, TradesBoard } from '../components/_external-pages/trading';

const ENDPOINT = process.env.REACT_APP_WS_API_URL;
const socket = io(`${ENDPOINT}`);
// ----------------------------------------------------------------------

export default function TradingView() {
  const theme = useTheme();
  const [currency, setCurrency] = useState('btc');
  const [interval, setInterval] = useState('1 min');
  const [cType, setCType] = useState(0);
  const [chartViewMode, setChartViewMode] = useState(1);
  const [lastPrice, setLastPrice] = useState({});
  const [lastOHLCData, setLastOHLCData] = useState({});

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
              lastOHLCData={lastOHLCData}
              onChartCurrency={(cur) => setCurrency(cur)}
              onChartInterval={(int) => setInterval(int)}
              onCType={(ctype) => setCType(ctype)}
              socket={socket}
            />
            <Box sx={{ width: '100%', height: '100%' }}>
              <Chart
                currency={currency}
                interval={interval}
                ctype={cType}
                chartViewMode={1}
                onSetLastPrice={(price) => setLastPrice(price)}
                onSetLastOHLCData={(ohlc) => setLastOHLCData(ohlc)}
                socket={socket}
              />
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
