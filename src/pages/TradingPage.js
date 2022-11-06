import React from 'react';
// material
import { Container, Box, Stack } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

// components
import Page from '../components/Page';

import { Chart, LongShort, OpenTradeOrders } from '../components/_external-pages/trading';
// ----------------------------------------------------------------------

export default function DesktopVersion() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Page title="Trading | LVRJ">
      <Container maxWidth="xl" m={1} sx={{ mb: 10 }}>
        <Box m={4} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box sx={{ width: '100%' }}>
            <Chart isLight={isLight} />
          </Box>
          <LongShort />
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
