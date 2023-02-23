/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { experimentalStyled as styled, makeStyles, useTheme } from '@material-ui/core/styles';

import { ContractContext } from 'src/contexts/ContractContext';
import Snackbar from '../../Snackbar';
import { ForexList, CryptoList, StockList } from './LongShort';

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
  Button,
  useMediaQuery,
  Select,
  MenuItem,
  Grid,
} from '@material-ui/core';

import { capitalCase } from 'change-case';
import { fNumberThousands } from '../../../utils/formatNumber';

// components
import TradesDetailDialog from './TradesDetailDialog';
import { isArray } from 'lodash';

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

const CloseTradeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#5600C3',
  boxShadow: 'none',
  fontSize: '12px',
  padding: theme.spacing(0.2, 1),
  borderRadius: '5px',
  fontWeight: 300,
  border: '0.5px solid rgba(255, 255, 255, 0.5)',
  '&:hover': {
    backgroundColor: '#420391d6'
  }
}));

export default function TradesBoard() {
  const theme = useTheme();
  const classes = useStyles();

  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  const [selectedTab, setSelectedTab] = useState(3);
  const [tradeList, setTradeList] = useState([]);

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const [isShowAlert, setIsShowAlert] = useState(false);

  const [userTradeList, setUserTradeList] = useState([]);

  const { tradingStorage, user, vault } = useContext(ContractContext);

  useEffect(() => {
    let trades = TRADES;
    switch (selectedTab) {
      case 0:
        getUserOpenTrades();
        break;
      case 1:
        getUserCloseTrades();
        break;
      case 2:
        trades = TRADES.slice(0, 5);
        break;
      default:
        trades = TRADES;
        break;
    }

    setTradeList([...trades]);
  }, [selectedTab]);
  
  const getUserOpenTrades = async () => {
    const trades = await tradingStorage.methods.getAllOpenTrades(user).call().then( (trades) => {
          let arr = [];
          for(let i=0; i < trades.length; i++) {
              const tradeIcon = getPairIcon(trades[i]) 
              const tradeDir = getOrderDirection(trades[i]);
              const newTrade = {...trades[i], icon: tradeIcon, orderDirection: tradeDir};
              arr.push(newTrade);
          }
          setTradeList(arr)
      })
  }

  const closeMarketOrder = async (tradeId) => {
      await vault.methods.closeOrder(tradeId).send({ from: user }).on('transactionHash', (hash) => {
        console.log(hash);
        setIsShowAlert(true);
      })

  }

  const getUserCloseTrades = async () => {
      const trades = await tradingStorage.methods.getAllClosedTrades(user).call().then((trades) => {
        let arr = [];
        for(let i=0; i < trades.length; i++) {
            const tradeIcon = getPairIcon(trades[i]) 
            const tradeDir = getOrderDirection(trades[i]);
            const newTrade = {...trades[i], icon: tradeIcon, orderDirection: tradeDir};
            arr.push(newTrade);
        }
        setTradeList(arr)
        console.log(arr)
      })
  }

  const removeDecimal = (num ,numDecimal) => {
      return num / 10**numDecimal;
  };

  const getPairIcon = (item) => {
     const assetList = CryptoList.concat(ForexList, StockList);
     for(let i=0; i < assetList.length; i++) {
         if(Number(item.pair) === assetList[i].currencyID) {
            return assetList[i].icon;
         }
     }
  }

  const getOrderDirection = (item) => {
     const assetList = CryptoList.concat(ForexList, StockList);
     for(let i=0; i < assetList.length; i++) {
        if(Number(item.orderType) === 2) {
           return "up";
        } else if (Number(item.orderType) === 3) {
           return "down";
        }
    }
  }

 

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
  if (selectedTab !== 3)
    return (
      <Card sx={{ p: 1, [theme.breakpoints.up('md')]: { p: 3 } }}>
        <TradesDetailDialog
          dialogContent={dialogContent}
          showDialog={showDetailDialog}
          onShowDialog={(isShow) => setShowDetailDialog(isShow)}
        />
        <Snackbar
          isOpen={isShowAlert}
          notiType="closed"
          notiDuration={NOTIFICATION_DURATION}
          onClose={() => setIsShowAlert(false)}
          longShort="Trade"
        />
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
                {upMd && selectedTab == 0 && <TableHeaderCell align="left">Liquidation Price</TableHeaderCell>}
                {upMd && <TableHeaderCell align="left">Leverage</TableHeaderCell>}
                {selectedTab == 0 && <TableHeaderCell align="left">Take Profit</TableHeaderCell>}
                {selectedTab == 0 && <TableHeaderCell align="left">Stop Loss</TableHeaderCell>}
                {selectedTab !== 0 && <TableHeaderCell align="left">Exit Price</TableHeaderCell>}
                <TableHeaderCell align="left">ROI</TableHeaderCell>
                {upMd && <TableHeaderCell sx={{ maxWidth: 65 }} />}
              </TableRow>
            </thead>

            <TableBody>
              {upMd &&
                tradeList.map((item, idx) => [
                  <TableRow key={idx}>
                    <TableBodyCell align="center">{item.trader.slice(0, 4)}{"..."}{item.trader.slice(39, 42)}</TableBodyCell>
                    <TableBodyCell align="left">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box component="img" src={item.icon}  sx={{ width: 25, height: 25, borderRadius: '50%' }} />
                        <Box
                          component="img"
                          src={`/static/icons/trading_ui/two_${item.orderDirection}_arrow.svg`}
                          sx={{ width: 12, margin: '0 5px' }}
                        />
                      </Stack>
                    </TableBodyCell>
                    <TableBodyCell align="left">{removeDecimal(item.entryPrice, 8)}</TableBodyCell>

                    {upMd && <TableBodyCell align="left">{removeDecimal(item.collateral, 18)}</TableBodyCell>}
                    {upMd && selectedTab == 0 && <TableBodyCell align="left">{removeDecimal(item.liquidationPrice, 8)}</TableBodyCell>}
                    {upMd && <TableBodyCell align="left">x{item.leverageAmount}</TableBodyCell>}
                    {selectedTab == 0 && <TableBodyCell align="left">{removeDecimal(item.takeProfit, 8)}</TableBodyCell>}
                    {selectedTab == 0 && <TableBodyCell align="left">{removeDecimal(item.stopLoss, 8)}</TableBodyCell>}

                    {selectedTab !== 0 && <TableBodyCell align="left">{removeDecimal(item.exitPrice, 8)}</TableBodyCell>}
                    <TableBodyCell align="left" sx={{ color: '#72F238' }}>
                      {item.roi}
                      {item.roi === '-' ? '' : '%'}
                    </TableBodyCell>
                    {upMd && (
                      <TableBodyCell align="right" sx={{ maxWidth: 85 }}>
                        <CloseTradeButton
                          variant="contained"
                          onClick={() => {
                            if (selectedTab !== 0) {
                            setShowDetailDialog(true);
                            setDialogContent({ ...item, selectedTab });
                            }else {
                              closeMarketOrder(idx); console.log(`trade id to close: ${idx}`)
                              setDialogContent({ ...item, selectedTab})
                           }
                          }}
                        >
                          {selectedTab !== 0 ? 'Details' : 'Close Trade'}
                        </CloseTradeButton>
                      </TableBodyCell>
                    )}
                  </TableRow>,
                  <TableRow key={`id-${idx}`}>
                    <TableCell colSpan={5} />
                  </TableRow>
                ])}
              {!upMd &&
                tradeList.map((item, idx) => [
                  <TableRow
                    key={idx}
                    onClick={() => {
                      if (selectedTab !== 0) {
                      setShowDetailDialog(true);
                      setDialogContent({ ...item, selectedTab });
                      }else {
                        closeMarketOrder(idx); console.log(`trade id to close: ${idx}`)
                        setDialogContent({ ...item, selectedTab})
                     }
                    }}
                  >
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

  return (
    <Card sx={{ p: 1, [theme.breakpoints.up('md')]: { p: 3 } }}>
      <TradesDetailDialog
        dialogContent={dialogContent}
        showDialog={showDetailDialog}
        onShowDialog={(isShow) => setShowDetailDialog(isShow)}
      />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={8}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} md={10}>
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
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
              <Stack
                direction="row"
                justifyContent={{ xs: 'center', md: 'flex-end' }}
                spacing={{ sm: 1, md: 3 }}
                sx={{ mb: 2 }}
              >
                <Select
                  defaultValue="day"
                  sx={{
                    '&>div': {
                      paddingTop: '0 !important',
                      paddingBottom: '0 !important',
                      fontSize: { xs: 12, md: 14, lg: 16 }
                    }
                  }}
                >
                  <MenuItem value="day">day</MenuItem>
                  <MenuItem value="week">week</MenuItem>
                  <MenuItem value="month">month</MenuItem>
                </Select>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={8}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <thead>
                <TableRow>
                  <TableHeaderCell align="left">#</TableHeaderCell>
                  <TableHeaderCell align="left">Trader</TableHeaderCell>
                  <TableHeaderCell align="left">Trades</TableHeaderCell>
                  <TableHeaderCell align="left">Win Rate</TableHeaderCell>
                  <TableHeaderCell align="left">PNL</TableHeaderCell>
                </TableRow>
              </thead>

              <TableBody>
                {LEADERBOARD.map((item, idx) => [
                  <TableRow key={idx}>
                    <TableBodyCell align="left">{idx + 1}</TableBodyCell>
                    <TableBodyCell align="left">{item.trader}</TableBodyCell>
                    <TableBodyCell align="left">{item.trades}</TableBodyCell>
                    <TableBodyCell align="left" sx={{ color: '#05FF00' }}>
                      {item.winRate}%
                    </TableBodyCell>
                    <TableBodyCell align="left">{fNumberThousands(item.pnl)}</TableBodyCell>
                  </TableRow>,
                  <TableRow key={`id-${idx}`}>
                    <TableCell colSpan={5} />
                  </TableRow>
                ])}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Paper sx={{ margin: 'auto', width: '70%', mb: 2 }}>
            <Typography variant="body1" textAlign="center" sx={{ mb: 1 }}>
              Your State
            </Typography>
            <Table size="small" aria-label="a dense table" sx={{ backgroundColor: '#3E3A59', borderRadius: '10px' }}>
              <TableBody>
                {Object.keys(LEADERBOARD[0]).map((key, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableBodyCell sx={{ width: '50%' }}>
                      {key === 'pnl' && (
                        <Typography variant="body2" sx={{ p: 1 }}>
                          {key.toUpperCase()}
                        </Typography>
                      )}
                      {key !== 'pnl' && (
                        <Typography variant="body2" sx={{ p: 1 }}>
                          {capitalCase(key)}
                        </Typography>
                      )}
                    </TableBodyCell>
                    <TableBodyCell sx={{ width: '50%' }}>
                      {key === 'winRate' && (
                        <Typography variant="body2" sx={{ color: '#05FF00' }}>
                          {LEADERBOARD[0][key]}%
                        </Typography>
                      )}
                      {key === 'pnl' && (
                        <Typography variant="body2">{fNumberThousands(LEADERBOARD[0][key])}</Typography>
                      )}
                      {key !== 'winRate' && key !== 'pnl' && (
                        <Typography variant="body2">{LEADERBOARD[0][key]}</Typography>
                      )}
                    </TableBodyCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Card>
  );
}

const NOTIFICATION_DURATION = 5000;

const TRADES = [
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
const LEADERBOARD = [
  {
    trader: '0x...6969',
    trades: 3,
    winRate: 66.6,
    pnl: 27690.12
  },
  {
    trader: '0x...x420',
    trades: 12,
    winRate: 75,
    pnl: 23650.15
  },
  {
    trader: '0x...0666',
    trades: 6,
    winRate: 50,
    pnl: 20580.22
  },
  {
    trader: '0x...6969',
    trades: 9,
    winRate: 33.3,
    pnl: 17690.12
  },
  {
    trader: '!.eth',
    trades: 4,
    winRate: 50,
    pnl: 13230.55
  }
];
