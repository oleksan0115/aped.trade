/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { experimentalStyled as styled, makeStyles, useTheme } from '@material-ui/core/styles';

import { ContractContext } from 'src/contexts/ContractContext';
import Snackbar from '../../Snackbar';
import { ForexList, CryptoList, StockList } from './LongShort';
import axios from 'axios';

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
  Slide,
  CircularProgress
} from '@material-ui/core';

import { Icon } from '@iconify/react';

import { capitalCase } from 'change-case';
import { fNumberThousands } from '../../../utils/formatNumber';

import PropTypes from 'prop-types';

// components
import TradesDetailDialog from './TradesDetailDialog';
import { isArray, upperCase } from 'lodash';


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

TradesBoard.propTypes = {
  handleSelectTab: PropTypes.func,
  handleLongShortTab: PropTypes.func,
  selectedTab: PropTypes.number,
  trigger: PropTypes.number
};
export default function TradesBoard({ handleSelectTab, handleLongShortTab, selectedTab, trigger }) {
  const theme = useTheme();
  const classes = useStyles();

  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  const [tradeList, setTradeList] = useState([]);

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const [isShowAlert, setIsShowAlert] = useState(false);

  const [userTradeList, setUserTradeList] = useState([]);

  const [slideChecked, setSlideChecked] = useState(true);

  const { tradingStorage, user, vault, tradingLogic } = useContext(ContractContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('selectedTab: ', selectedTab);
    let trades = [];
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

  useEffect(() => {
    if (trigger > 0) getUserOpenTrades();
  }, [trigger]);



  const getUserOpenTrades = async () => {
    setLoading(true);
    const trades = await tradingStorage.methods
      .getAllOpenTrades(user)
      .call()
      .then((trades) => {
        let arr = [];
        for (let i = 0; i < trades.length; i++) {
          const tradeIcon = getPairIcon(trades[i]);
          const tradeDir = getOrderDirection(trades[i]);
          const tradeName = getPairName(trades[i]);
          const newTrade = { ...trades[i], pair: { icon: tradeIcon, orderDirection: tradeDir, name: tradeName } };
          arr.push(newTrade);
        }
        setTradeList(arr);
        setLoading(false);
      });
  };

  const closeMarketOrder = async (tradeId) => {
    await vault.methods
      .closeOrder(tradeId)
      .send({ from: user })
      .on('transactionHash', (hash) => {
        console.log('hash:', hash);
        setIsShowAlert(true);
        setTimeout(() => {
          getUserCloseTrades();
          handleLongShortTab(1);
        }, 7000);
      });
  };

  const getUserCloseTrades = async () => {
    setLoading(true);
    const trades = await tradingStorage.methods
      .getAllClosedTrades(user)
      .call()
      .then((trades) => {
        let arr = [];
        for (let i = 0; i < trades.length; i++) {
          const tradeIcon = getPairIcon(trades[i]);
          const tradeDir = getOrderDirection(trades[i]);
          const tradeName = getPairName(trades[i]);
          let newTrade = { pair: { icon: tradeIcon, orderDirection: tradeDir, name: tradeName } };
          if (trades[i].trader) newTrade.trader = trades[i].trader;
          if (trades[i].traderId) newTrade.traderId = trades[i].traderId;
          if (trades[i].openTimestamp) newTrade.openTimestamp = new Date(trades[i].openTimestamp * 1000).toLocaleString();
          if (trades[i].closeTimestamp)
            newTrade.closeTimestamp = new Date(trades[i].closeTimestamp * 1000).toLocaleString();
          if (trades[i].orderType) newTrade.orderType = trades[i].trader;
          if (trades[i].leverageAmount) newTrade.leverageAmount = trades[i].leverageAmount;
          if (trades[i].collateral) newTrade.collateral = removeDecimal(trades[i].collateral, 18);
          if (trades[i].entryPrice) newTrade.entryPrice = removeDecimal(trades[i].entryPrice, 8);
          if (trades[i].exitPrice) newTrade.exitPrice = removeDecimal(trades[i].exitPrice, 8);
          if (trades[i].pnl) newTrade.pnl = trades[i].pnl;
          arr.push(newTrade);
        }
        setTradeList(arr);
        console.log('closed trades list: ', arr);
        setLoading(false);
      });
  };

  

  const getTradePnl = async (entry, current, leverage, collateral, order) => {
     const pnl = await tradingLogic.methods.calculatePnL(entry, current, leverage, collateral, order);
     const roi = (pnl / collateral) * 100;

     return roi;
  };

  const removeDecimal = (num, numDecimal) => {
    return num / 10 ** numDecimal;
  };

  const getPairIcon = (item) => {
    const assetList = CryptoList.concat(ForexList, StockList);
    for (let i = 0; i < assetList.length; i++) {
      if (Number(item.pair) === assetList[i].currencyID) {
        return assetList[i].icon;
      }
    }
  };
  const getPairName = (item) => {
    const assetList = CryptoList.concat(ForexList, StockList);
    for (let i = 0; i < assetList.length; i++) {
      if (Number(item.pair) === assetList[i].currencyID) {
        return upperCase(assetList[i].name);
      }
    }
  };

  // const getPairAPI = (item) => {
  //   const assetList = CryptoList.concat(ForexList, StockList);
  //   for (let i =0; i< assetList.length; i++) {
  //     if (Number(item.pair) === assetList[i].currencyID) {
  //       return assetList[i].api;
  //     }
  //   }
  // }

  const getPairCurrentPrice = async (item) => {
    const assetList = [...CryptoList, ...ForexList, ...StockList];
    for (let i = 0; i < assetList.length; i++) {
      if (Number(item.pair) === assetList[i].currencyID) {
        const response = await axios.get(String(assetList[i].api));
        const data = response.data;
        const sortedKeys = Object.keys(data).sort();
        const secondKey = sortedKeys[1];
        const secondValue = data[secondKey];
        const pnl = await tradingLogic.methods.calculatePnL(item.entryPrice, secondValue, item.leverageAmount, item.collateral, item.orderType);
        const roi = (pnl / collateral) * 100;
  
        return roi;
      }
    }
  };
  

  const getOrderDirection = (item) => {
    const assetList = CryptoList.concat(ForexList, StockList);
    for (let i = 0; i < assetList.length; i++) {
      if (Number(item.orderType) === 2) {
        return 'up';
      } else if (Number(item.orderType) === 3) {
        return 'down';
      }
    }
  };

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
          tab={selectedTab}
          loading={loading}
          showDialog={showDetailDialog}
          onShowDialog={(isShow) => setShowDetailDialog(isShow)}
        />
        <Snackbar
          isOpen={isShowAlert}
          notiType="closed"
          notiDuration={NOTIFICATION_DURATION}
          onClose={() => setIsShowAlert(false)}
          longShort="Trade"
          currency={dialogContent?.pair?.name}
        />
        {!upMd && (
          <Slide direction="left" in={slideChecked} mountOnEnter unmountOnExit>
            <Stack
              direction="row"
              justifyContent={{ xs: 'space-around', md: 'flex-start' }}
              spacing={{ sm: 1, md: 3 }}
              sx={{ mb: 2 }}
            >
              <TabStyles variant="body2" onClick={() => handleSelectTab(0)} selected={0}>
                Active Trades
              </TabStyles>
              <TabStyles variant="body2" onClick={() => handleSelectTab(1)} selected={1}>
                Closed Trades
              </TabStyles>
              <TabStyles variant="body2" onClick={() => handleSelectTab(2)} selected={2}>
                Public Trades
              </TabStyles>
              {upMd && (
                <TabStyles variant="body2" onClick={() => handleSelectTab(3)} selected={3}>
                  Leaderboard
                </TabStyles>
              )}
            </Stack>
          </Slide>
        )}
        {upMd && (
          <Stack
            direction="row"
            justifyContent={{ xs: 'space-around', md: 'flex-start' }}
            spacing={{ sm: 1, md: 3 }}
            sx={{ mb: 2 }}
          >
            <TabStyles variant="body2" onClick={() => handleSelectTab(0)} selected={0}>
              Active Trades
            </TabStyles>
            <TabStyles variant="body2" onClick={() => handleSelectTab(1)} selected={1}>
              Closed Trades
            </TabStyles>
            <TabStyles variant="body2" onClick={() => handleSelectTab(2)} selected={2}>
              Public Trades
            </TabStyles>
            {upMd && (
              <TabStyles variant="body2" onClick={() => handleSelectTab(3)} selected={3}>
                Leaderboard
              </TabStyles>
            )}
          </Stack>
        )}
        <TableContainer component={Paper}>
          {!upMd && (
            <Slide direction="left" in={slideChecked} mountOnEnter unmountOnExit>
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
                    {!upMd && <TableHeaderCell sx={{ maxWidth: 65 }} />}
                  </TableRow>
                </thead>

                <TableBody>
                  {loading && (
                    <Stack direction="column" justifyContent="center" alignItems="center">
                      <CircularProgress color="success" />
                    </Stack>
                  )}
                  {!loading &&
                    upMd &&
                    tradeList.map((item, idx) => [
                      <TableRow key={idx}>
                        <TableBodyCell align="center">
                          {item.trader.slice(0, 4)}
                          {'...'}
                          {item.trader.slice(39, 42)}
                        </TableBodyCell>
                        <TableBodyCell align="left">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              component="img"
                              src={item.pair.icon}
                              sx={{ width: 25, height: 25, borderRadius: '50%' }}
                            />
                            <Box
                              component="img"
                              src={`/static/icons/trading_ui/two_${item.pair.orderDirection}_arrow.svg`}
                              sx={{ width: 12, margin: '0 5px' }}
                            />
                          </Stack>
                        </TableBodyCell>
                        <TableBodyCell align="left">{removeDecimal(item.entryPrice, 8)}</TableBodyCell>

                        {upMd && <TableBodyCell align="left">{removeDecimal(item.collateral, 18)}</TableBodyCell>}
                        {upMd && selectedTab == 0 && (
                          <TableBodyCell align="left">{removeDecimal(item.liquidationPrice, 8)}</TableBodyCell>
                        )}
                        {upMd && <TableBodyCell align="left">x{item.leverageAmount}</TableBodyCell>}
                        {selectedTab == 0 && (
                          <TableBodyCell align="left">{removeDecimal(item.takeProfit, 8)}</TableBodyCell>
                        )}
                        {selectedTab == 0 && (
                          <TableBodyCell align="left">{removeDecimal(item.stopLoss, 8)}</TableBodyCell>
                        )}

                        {selectedTab !== 0 && (
                          <TableBodyCell align="left">{removeDecimal(item.exitPrice, 8)}</TableBodyCell>
                        )}
                        <TableBodyCell align="left" sx={{ color: '#72F238' }}>
                          {/* {getPairCurrentPrice(item)} */}
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
                                  setDialogContent({ ...item });
                                } else {
                                  closeMarketOrder(idx);
                                  console.log(`trade id to close: ${idx}`);
                                  setDialogContent({ ...item });
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
                  {!loading &&
                    !upMd &&
                    tradeList.map((item, idx) => [
                      <TableRow
                        key={idx}
                        onClick={() => {
                          if (selectedTab !== 0) {
                            setShowDetailDialog(true);
                            setDialogContent({ ...item });
                          } else {
                            closeMarketOrder(idx);
                            console.log(`trade id to close: ${idx}`);
                            setDialogContent({ ...item });
                          }
                        }}
                      >
                        <TableBodyCell align="center">{item.trader}</TableBodyCell>
                        <TableBodyCell align="left">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              component="img"
                              src={item.pair.icon}
                              sx={{ width: 25, height: 25, borderRadius: '50%' }}
                            />
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
            </Slide>
          )}
          {upMd && (
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
                  {!upMd && <TableHeaderCell sx={{ maxWidth: 65 }} />}
                </TableRow>
              </thead>

              <TableBody>
                {loading && (
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <CircularProgress color="success" />
                  </Stack>
                )}
                {!loading &&
                  upMd &&
                  tradeList.map((item, idx) => [
                    <TableRow key={idx}>
                      <TableBodyCell align="center">
                        {item.trader.slice(0, 4)}
                        {'...'}
                        {item.trader.slice(39, 42)}
                      </TableBodyCell>
                      <TableBodyCell align="left">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            component="img"
                            src={item.pair.icon}
                            sx={{ width: 25, height: 25, borderRadius: '50%' }}
                          />
                          <Box
                            component="img"
                            src={`/static/icons/trading_ui/two_${item.pair.orderDirection}_arrow.svg`}
                            sx={{ width: 12, margin: '0 5px' }}
                          />
                        </Stack>
                      </TableBodyCell>
                      <TableBodyCell align="left">{removeDecimal(item.entryPrice, 8)}</TableBodyCell>

                      {upMd && <TableBodyCell align="left">{removeDecimal(item.collateral, 18)}</TableBodyCell>}
                      {upMd && selectedTab == 0 && (
                        <TableBodyCell align="left">{removeDecimal(item.liquidationPrice, 8)}</TableBodyCell>
                      )}
                      {upMd && <TableBodyCell align="left">x{item.leverageAmount}</TableBodyCell>}
                      {selectedTab == 0 && (
                        <TableBodyCell align="left">{removeDecimal(item.takeProfit, 8)}</TableBodyCell>
                      )}
                      {selectedTab == 0 && (
                        <TableBodyCell align="left">{removeDecimal(item.stopLoss, 8)}</TableBodyCell>
                      )}

                      {selectedTab !== 0 && (
                        <TableBodyCell align="left">{removeDecimal(item.exitPrice, 8)}</TableBodyCell>
                      )}
                      <TableBodyCell align="left" sx={{ color: '#72F238' }}>
                        {/* {getPairCurrentPrice(item)} */}
                        {item.roi === '-' ? '' : '%'}
                      </TableBodyCell>
                      {upMd && (
                        <TableBodyCell align="right" sx={{ maxWidth: 85 }}>
                          <CloseTradeButton
                            variant="contained"
                            onClick={() => {
                              if (selectedTab !== 0) {
                                setShowDetailDialog(true);
                                setDialogContent({ ...item });
                              } else {
                                closeMarketOrder(idx);
                                console.log(`trade id to close: ${idx}`);
                                setDialogContent({ ...item });
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
                {!loading &&
                  !upMd &&
                  tradeList.map((item, idx) => [
                    <TableRow
                      key={idx}
                      onClick={() => {
                        if (selectedTab !== 0) {
                          setShowDetailDialog(true);
                          setDialogContent({ ...item });
                        } else {
                          closeMarketOrder(idx);
                          console.log(`trade id to close: ${idx}`);
                          setDialogContent({ ...item });
                        }
                      }}
                    >
                      <TableBodyCell align="center">{item.trader}</TableBodyCell>
                      <TableBodyCell align="left">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            component="img"
                            src={item.pair.icon}
                            sx={{ width: 25, height: 25, borderRadius: '50%' }}
                          />
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
          )}
        </TableContainer>
        {!upMd && (
          <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mr: 2 }}>
            <Typography
              variant="body2"
              sx={{ textAlign: 'left' }}
              onClick={(e) => {
                setSlideChecked(false);
                handleSelectTab(3);
              }}
            >
              Leaderboard
            </Typography>
            <Icon icon="material-symbols:arrow-forward-ios" />
          </Stack>
        )}
      </Card>
    );
  if (upMd)
    return (
      <Card sx={{ p: 1, [theme.breakpoints.up('md')]: { p: 3 } }}>
        <TradesDetailDialog
          dialogContent={dialogContent}
          tab={selectedTab}
          loading={loading}
          showDialog={showDetailDialog}
          onShowDialog={(isShow) => setShowDetailDialog(isShow)}
        />
        <Grid container rowspacing={1} columnspacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item md={8}>
            <Grid container rowspacing={1} columnspacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item md={10}>
                <Stack
                  direction="row"
                  justifyContent={{ xs: 'space-around', md: 'flex-start' }}
                  spacing={{ sm: 1, md: 3 }}
                  sx={{ mb: 2 }}
                >
                  <TabStyles variant="body2" onClick={() => handleSelectTab(0)} selected={0}>
                    Active Trades
                  </TabStyles>
                  <TabStyles variant="body2" onClick={() => handleSelectTab(1)} selected={1}>
                    Closed Trades
                  </TabStyles>
                  <TabStyles variant="body2" onClick={() => handleSelectTab(2)} selected={2}>
                    Public Trades
                  </TabStyles>

                  <TabStyles variant="body2" onClick={() => handleSelectTab(3)} selected={3}>
                    Leaderboard
                  </TabStyles>
                </Stack>
              </Grid>
              <Grid item md={2}>
                <Stack direction="row" justifyContent={{ md: 'flex-end' }} spacing={{ md: 3 }} sx={{ mb: 2 }}>
                  <Select
                    defaultValue="day"
                    sx={{
                      '&>div': {
                        paddingTop: '0 !important',
                        paddingBottom: '0 !important',
                        fontSize: { md: 14, lg: 16 }
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
        <Grid container rowspacing={1} columnspacing={{ md: 3 }}>
          <Grid item md={8}>
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
          <Grid item md={4}>
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
  return (
    <Slide direction="right" in={!slideChecked} mountOnEnter unmountOnExit>
      <Card sx={{ p: 1, [theme.breakpoints.up('md')]: { p: 3 } }}>
        <TradesDetailDialog
          dialogContent={dialogContent}
          tab={selectedTab}
          loading={loading}
          showDialog={showDetailDialog}
          onShowDialog={(isShow) => setShowDetailDialog(isShow)}
        />
        <Grid container rowspacing={1} columnspacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12}>
            <Grid container rowspacing={1} columnspacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12}>
                <Stack
                  direction="row"
                  justifyContent={{ xs: 'space-around' }}
                  spacing={{ sm: 1, md: 3 }}
                  sx={{ mb: 2, position: 'relative' }}
                  onClick={(e) => {
                    setSlideChecked(true);
                    handleSelectTab(2);
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{ ml: 1, position: 'absolute', left: 0, cursor: 'pointer' }}
                  >
                    <Icon icon="material-symbols:arrow-back-ios" />
                    <Typography variant="body2" sx={{ textAlign: 'left' }}>
                      Trade
                    </Typography>
                  </Stack>
                  <TabStyles
                    variant="body2"
                    onClick={() => handleSelectTab(3)}
                    selected={3}
                    sx={{ fontSize: { xs: 20, sm: 24 } }}
                  >
                    Leaderboard
                  </TabStyles>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Stack
                  direction="row"
                  justifyContent={{ xs: 'center', md: 'flex-end' }}
                  spacing={{ sm: 1 }}
                  sx={{ mb: 2 }}
                >
                  <Select
                    defaultValue="day"
                    sx={{
                      '&>div': {
                        paddingTop: '0 !important',
                        paddingBottom: '0 !important',
                        fontSize: { xs: 12 }
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
        <Grid container rowspacing={1} columnspacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} sm={12}>
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
          <Grid item xs={12} sm={12}>
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
    </Slide>
  );
}

const NOTIFICATION_DURATION = 5000;

const TRADES = [
  {
    trader: '0x...6969',
    pair: {
      icon: '/static/icons/crypto/btc.webp',
      orderDirection: 'down'
    },
    icon: '/static/icons/crypto/btc.webp',
    orderDirection: 'down',
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
      orderDirection: 'up'
    },
    icon: '/static/icons/crypto/link.png',
    orderDirection: 'up',
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
      orderDirection: 'up'
    },
    icon: '/static/icons/crypto/dai.png',
    orderDirection: 'up',
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
      orderDirection: 'down'
    },
    icon: '/static/icons/forex/EU.svg',
    orderDirection: 'down',
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
      orderDirection: 'down'
    },
    icon: '/static/icons/stocks/apple.svg',
    orderDirection: 'down',
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
      orderDirection: 'down'
    },
    icon: '/static/icons/leaderboard/bitcoin.svg',
    orderDirection: 'down',
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
      orderDirection: 'up'
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
      orderDirection: 'up'
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
      orderDirection: 'down'
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
      orderDirection: 'down'
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
