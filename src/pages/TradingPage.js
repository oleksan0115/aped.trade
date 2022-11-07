import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
// material
import { Container, Box, Stack } from '@material-ui/core';

// components
import Page from '../components/Page';

import { Chart, ChartStatus, LongShort, OpenTradeOrders } from '../components/_external-pages/trading';
// ----------------------------------------------------------------------

export default function DesktopVersion() {
  const theme = useTheme();
  const [currency, setCurrency] = useState('btc');
  const [chartViewMode, setChartViewMode] = useState(1);
  const [lastPrice, setLastPrice] = useState({});

  return (
    <Page title="Trading | LVRJ">
      <Container maxWidth="xl" m={1} sx={{ mb: 10, mt: 10, [theme.breakpoints.up('md')]: { mt: 1 } }}>
        <Box m={4} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Stack spacing={1} direction="column" sx={{ width: '100%' }}>
            <ChartStatus lastPrice={lastPrice} chartViewMode={chartViewMode} />
            <Box sx={{ width: '100%', height: '100%' }}>
              <Chart currency={currency} chartViewMode={1} onSetLastPrice={(price) => setLastPrice(price)} />
            </Box>
          </Stack>
          <LongShort onChartCurrency={(cur) => setCurrency(cur)} onChartViewMode={(vm) => setChartViewMode(vm)} />
        </Stack>
        <Box m={3} />
        <OpenTradeOrders
          title="Active Trades, Closed Trades, Public Trades, Learderboard"
          content="Collaterals, profits, losses, are in DAI"
        />
      </Container>
    </Page>
  );
}
