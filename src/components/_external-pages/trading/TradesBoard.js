import React, { useState, useEffect } from 'react';
import { experimentalStyled as styled, makeStyles, useTheme } from '@material-ui/core/styles';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Stack,
  Box,
  Typography,
  useMediaQuery
} from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 320
  }
});

const TableBodyCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#3E3A59',
  '&:first-of-type': {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  '&:last-of-type': {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '11px',
    padding: theme.spacing(1),
    '&:first-of-type': {
      paddingLeft: 5
    },
    '&:last-of-type': {
      paddingRight: 5
    }
  }
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: '11px',
    padding: theme.spacing(1),
    '&:first-of-type': {
      paddingLeft: 5
    },
    '&:last-of-type': {
      paddingRight: 5
    }
  }
}));

export default function TradesBoard() {
  const theme = useTheme();
  const classes = useStyles();

  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  const [selectedTab, setSelectedTab] = useState(3);
  const [tradeList, setTradeList] = useState([]);

  useEffect(() => {
    let trades = LEADERBOARD;
    switch (selectedTab) {
      case 0:
        trades = LEADERBOARD.slice(0, 2).map((item) => ({ ...item, exitPrice: '-', roi: '-' }));
        break;
      case 1:
        trades = LEADERBOARD.slice(0, 2);
        break;
      case 2:
        trades = LEADERBOARD.slice(0, 5);
        break;
      default:
        trades = LEADERBOARD;
        break;
    }

    setTradeList([...trades]);
  }, [selectedTab]);

  const TabStyles = styled(Typography)(({ selected, theme }) => ({
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '11px',
    lineHeight: '19px',
    '&:hover': {
      color: '#FD02BD',
      textShadow: ' 0px 0px 3.5px #FD02BD'
    },
    ...(selected === selectedTab && { color: '#FD02BD', textShadow: ' 0px 0px 3.5px #FD02BD' }),
    [theme.breakpoints.up('md')]: {
      fontSize: '16px'
    }
  }));

  return (
    <Card sx={{ p: 1, [theme.breakpoints.up('md')]: { p: 3 } }}>
      <Stack
        direction="row"
        justifyContent={{ xs: 'space-between', md: 'flex-start' }}
        spacing={{ sm: 1, md: 3 }}
        sx={{ mb: 2 }}
      >
        <TabStyles variant="body2" onClick={() => setSelectedTab(0)} selected={0}>
          Active Trades
        </TabStyles>
        <TabStyles variant="body2" onClick={() => setSelectedTab(1)} selected={1}>
          Closed Trades
        </TabStyles>
        <TabStyles variant="body2" onClick={() => setSelectedTab(2)} selected={2}>
          Public Trades
        </TabStyles>
        <TabStyles variant="body2" onClick={() => setSelectedTab(3)} selected={3}>
          Leaderboard
        </TabStyles>
      </Stack>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <thead>
            <TableRow>
              <TableHeaderCell align="center">Trader</TableHeaderCell>
              <TableHeaderCell align="left">Pair</TableHeaderCell>
              <TableHeaderCell align="left">Entry Price</TableHeaderCell>
              {upMd && <TableHeaderCell align="left">Collateral</TableHeaderCell>}
              {upMd && <TableHeaderCell align="left">Liquidation Price</TableHeaderCell>}
              {upMd && <TableHeaderCell align="left">Leverage</TableHeaderCell>}
              <TableHeaderCell align="left">Exit Price</TableHeaderCell>
              <TableHeaderCell align="left">ROI</TableHeaderCell>
            </TableRow>
          </thead>

          <TableBody>
            {tradeList.map((item, idx) => [
              <TableRow key={idx}>
                <TableBodyCell align="center">{item.trader}</TableBodyCell>
                <TableBodyCell align="left">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box component="img" src={item.pair.icon} sx={{ width: 25, height: 25, borderRadius: '50%' }} />
                    <Box
                      component="img"
                      src={`/static/icons/trading_ui/two_${item.pair.direction}_arrow.svg`}
                      sx={{ width: 12, margin: '0 5px' }}
                    />
                  </Stack>
                </TableBodyCell>
                <TableBodyCell align="left">{item.entryPrice}</TableBodyCell>

                {upMd && <TableBodyCell align="left">{item.collateral}</TableBodyCell>}
                {upMd && <TableBodyCell align="left">{item.liquidationPrice}</TableBodyCell>}
                {upMd && <TableBodyCell align="left">x{item.leverage}</TableBodyCell>}

                <TableBodyCell align="left">{item.exitPrice}</TableBodyCell>
                <TableBodyCell align="left" sx={{ color: '#72F238' }}>
                  {item.roi}
                  {item.roi === '-' ? '' : '%'}
                </TableBodyCell>
              </TableRow>,
              <TableRow key={`id-${idx}`}>
                <TableCell colSpan={5} />
              </TableRow>
            ])}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

const LEADERBOARD = [
  {
    trader: '0x...6969',
    pair: {
      icon: '/static/icons/crypto/btc.webp',
      direction: 'down'
    },
    entryPrice: 17420.62,
    collateral: 250.21,
    liquidationPrice: 17602.12,
    leverage: 220,
    exitPrice: 17012.12,
    roi: 51.11
  },
  {
    trader: '0x...d420',
    pair: {
      icon: '/static/icons/crypto/link.png',
      direction: 'up'
    },
    entryPrice: 6.54,
    collateral: 1230.0,
    liquidationPrice: 6.32,
    leverage: 25,
    exitPrice: 6.83,
    roi: 42.14
  },
  {
    trader: '0x...0666',
    pair: {
      icon: '/static/icons/crypto/dai.png',
      direction: 'up'
    },
    entryPrice: 0.0702,
    collateral: 69.69,
    liquidationPrice: 0.06821,
    leverage: 50,
    exitPrice: 0.0756,
    roi: 33.13
  },
  {
    trader: 'trade.eth',
    pair: {
      icon: '/static/icons/forex/EU.svg',
      direction: 'down'
    },
    entryPrice: 1.04,
    collateral: 350.0,
    liquidationPrice: 1.06,
    leverage: 300,
    exitPrice: 1.02,
    roi: 25.21
  },
  {
    trader: '0x...6969',
    pair: {
      icon: '/static/icons/stocks/apple.svg',
      direction: 'down'
    },
    entryPrice: 151.07,
    collateral: 555.55,
    liquidationPrice: 155.11,
    leverage: 100,
    exitPrice: 142.16,
    roi: 19.54
  },
  {
    trader: 'aped.eth',
    pair: {
      icon: '/static/icons/leaderboard/bitcoin.svg',
      direction: 'down'
    },
    entryPrice: 17450.51,
    collateral: 26554.26,
    liquidationPrice: 17450.51,
    leverage: 100,
    exitPrice: 17430.51,
    roi: 16.25
  },
  {
    trader: '0x...x420',
    pair: {
      icon: '/static/icons/leaderboard/amd.svg',
      direction: 'up'
    },
    entryPrice: 76.4,
    collateral: 456.56,
    liquidationPrice: 79.65,
    leverage: 69,
    exitPrice: 142.16,
    roi: 11.54
  },
  {
    trader: 'leverage.eth',
    pair: {
      icon: '/static/icons/leaderboard/dogecoin.svg',
      direction: 'up'
    },
    entryPrice: 0.0721,
    collateral: 25.26,
    liquidationPrice: 36.54,
    leverage: 100,
    exitPrice: 0.082,
    roi: 10.13
  },
  {
    trader: '0x...6969',
    pair: {
      icon: '/static/icons/leaderboard/eth.svg',
      direction: 'down'
    },
    entryPrice: 1148.21,
    collateral: 1125.25,
    liquidationPrice: 155.11,
    leverage: 68,
    exitPrice: 142.16,
    roi: 5.29
  },
  {
    trader: 'apedceo.eth',
    pair: {
      icon: '/static/icons/leaderboard/goldbar.svg',
      direction: 'down'
    },
    entryPrice: 16.3,
    collateral: 25.36,
    liquidationPrice: 25.6,
    leverage: 64,
    exitPrice: 36.25,
    roi: 2.14
  }
];
