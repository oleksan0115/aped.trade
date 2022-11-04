import React from 'react';
// material
import { Container, Box, Grid } from '@material-ui/core';
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} lg={9} sx={{ [theme.breakpoints.down('md')]: { minHeight: 400 } }}>
            <Chart isLight={isLight} />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <LongShort />
          </Grid>
        </Grid>
        <Box m={3} />
        <OpenTradeOrders title="Your Open Trades" content="Collaterals, profits, losses, are in DAI" />
      </Container>
    </Page>
  );
}
