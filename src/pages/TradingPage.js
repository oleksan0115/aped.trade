import React, { useState } from 'react';
// material
import { Container, Box, Stack } from '@material-ui/core';

// components
import Page from '../components/Page';

import { Chart, LongShort, OpenTradeOrders } from '../components/_external-pages/trading';
// ----------------------------------------------------------------------

export default function DesktopVersion() {
  const [currency, setCurrency] = useState('btc');
  const [chartViewMode, setChartViewMode] = useState(1);

  console.log(chartViewMode);
  return (
    <Page title="Trading | LVRJ">
      <Container maxWidth="xl" m={1} sx={{ mb: 10 }}>
        <Box m={4} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box sx={{ width: '100%' }}>
            <Chart currency={currency} chartViewMode={1} />
          </Box>
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
