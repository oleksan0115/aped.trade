/* eslint-disable */
import { sentenceCase, upperCase } from 'change-case-all';
import PropTypes from 'prop-types';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  TextField,
  List,
  ListItem,
  Button,
  InputAdornment,
  Grid,
  ListItemText,
  MenuItem
} from '@material-ui/core';

// components
import MenuPopover from '../../MenuPopover';
import StableCoinPopover from './StableCoinPopover';
import Snackbar from '../../Snackbar';

// hooks
import useSettings from '../../../hooks/useSettings';

// utils
import { fCurrency } from '../../../utils/formatNumber';

import { getPreviousChartData1 as getPreviousChartData } from './api';
//import { getPreviousChartData} from './api';

// web3
import { ContractContext } from 'src/contexts/ContractContext';

const TabContainer = styled(Tabs)(({ theme }) => ({
  minHeight: 24,
  borderRadius: '10px',
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiButtonBase-root:not(:last-child)': { marginRight: 0 },
  '& .MuiTabs-flexContainer': {
    justifyContent: 'space-between',
    padding: 2,
    borderRadius: '10px',
    backgroundColor: '#0E0D14',
    width: '168px',
    [theme.breakpoints.up('md')]: {
      width: '164px'
    },
    '& .MuiButtonBase-root': {
      fontWeight: 300,
      minHeight: 24,
      padding: theme.spacing(0, 1.7),
      borderRadius: 15
    }
  }
}));

const TabStyles = styled(Tab)(() => ({
  '&.Mui-selected': {
    backgroundColor: '#5600C3'
  }
}));

const NotEnoughBalance = styled('div')(({ theme }) => ({
  width: 'fit-content',
  margin: 'auto',
  borderRadius: theme.spacing(1),
  backgroundColor: '#5600C3',
  padding: theme.spacing(0.5, 2)
}));

LongShort.propTypes = {
  currency: PropTypes.string,
  ctype: PropTypes.number,
  handleSelectTab: PropTypes.func,
  onChartViewMode: PropTypes.func,
  socket: PropTypes.object
};

export default function LongShort({ currency, ctype, handleSelectTab, onChartViewMode, socket }) {
  const theme = useTheme();
  const { stopLossMode } = useSettings();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [viewMode, setViewMode] = useState(1);
  const [sliderValue, setSliderValue] = useState(25.0);

  const [sliderLoseValue, setSliderLoseValue] = useState(5);
  const [sliderProfitValue, setSliderProfitValue] = useState(5);

  const [longShort, setLongShort] = useState('long');
  const [marketLimit, setMarketLimit] = useState('market');
  const [showLoseSlideBar, setShowLoseSildeBar] = useState(false);
  const [showProfitSlideBar, setShowProfitSildeBar] = useState(false);

  const [editedLosePrice, setEditedLosePrice] = useState(0);

  const [isShowAlert, setIsShowAlert] = useState(false);

  const [minMax, setMinMax] = useState({});

  const [cPrice, setCPrice] = useState(0);
  const [curPrice, setCurPrice] = useState(0);
  const [pair, setPair] = useState('');

  const [entryPrice, setEntryPrice] = useState(0);

  const [collateralValue, setCollateralValue] = useState(27.59);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [liqPrice, LiqPrice] = useState(0);

  const [accBalance, setAccBalance] = useState();

  //contract object
  const { vault, user, dai } = useContext(ContractContext);

  useEffect(() => {
    setMinMax(MIN_MAX[ctype]);
    onChartViewMode(viewMode);
  }, [viewMode, ctype]);

  useEffect(() => {
    if (isShowAlert) {
      setTimeout(() => setIsShowAlert(false), NOTIFICATION_DURATION);
    }
  }, [isShowAlert]);

  useEffect(() => {
    setEntryPrice(cPrice);
    if (cPrice) {
      setCurPrice(cPrice);
    }
  }, [cPrice]);

  useEffect(() => {
    const lsSign = longShort === 'long' ? -1 : 1;
    const ls = Number(entryPrice) + lsSign * (entryPrice / sliderValue) * (sliderLoseValue / 100);
    setLoss(ls);
  }, [longShort, entryPrice, sliderLoseValue, sliderValue]);

  useEffect(() => {
    const pfSign = longShort === 'long' ? 1 : -1;
    const pf = Number(entryPrice) + pfSign * (entryPrice / sliderValue) * (sliderProfitValue / 100);
    setProfit(pf);
  }, [longShort, entryPrice, sliderProfitValue, sliderValue]);

  useEffect(() => {
    // Liquidation Price Distance = Open Price * (Collateral * 0.9 ) / Collateral / Leverage.
    // If Long: Open Price - Liquidation Price Distance
    // If Short: Open Price + Liquidation Price Distance.
    const priceDis = (Number(cPrice) * (collateralValue * 0.9)) / collateralValue / sliderValue;

    const lql = Number(cPrice) - priceDis;
    const lqs = Number(cPrice) + priceDis;
    const lq = longShort === 'long' ? lql : lqs;
    LiqPrice(lq.toFixed(3));
  }, [sliderValue, collateralValue, cPrice, longShort]);

  useEffect(() => {
    let lastOHLCData = {};
    let pairString = '';
    const lastTime = Date.now();
    const startTime = lastTime - 3 * 24 * 60 * 60 * 1000;

    if (PriceTypes[ctype] === 'crypto') pairString = `${currency.toUpperCase()}-USD`;
    else if (PriceTypes[ctype] === 'forex') pairString = `${currency.toUpperCase()}/USD`;
    else pairString = `${currency.toUpperCase()}`;

    setPair(pairString);

    getPreviousChartData(currency, '1 min', PriceTypes[ctype], startTime, lastTime).then((pastData) => {
      if (pastData) {
        pastData.map((d) => {
          const currentDate = new Date();
          const mil = currentDate.getTimezoneOffset();
          const time = new Date(d.t).getTime() / 1000 - mil * 60;

          lastOHLCData = {
            close: d.c,
            high: d.h,
            low: d.l,
            open: d.o,
            time
          };
          return lastOHLCData;
        });

        setCPrice(lastOHLCData.close);
      }
    });

    const handler = (t) => {
      let closePrice = 0;
      let pair = '';
      if (PriceTypes[ctype] === 'crypto') {
        closePrice = t.p;
        pair = t.pair;
      } else if (PriceTypes[ctype] === 'forex') {
        closePrice = t.a;
        pair = t.p;
      } else {
        closePrice = (t.ap + t.bp) / 2;
        pair = t.sym;
      }
      try {
        if (pair === pairString) setCPrice(closePrice.toFixed(3));
      } catch (e) {
        /* Error hanlding codes */
      }
    };

    socket.on(`${PriceTypes[ctype]}_trade_data`, handler);

    return () => {
      socket.off(`${PriceTypes[ctype]}_trade_data`, handler);
    };
  }, [currency, ctype]);

  useEffect(() => {
    if (user != '') {
      getAccountBalance();
      console.log('currency: ', currency);
      console.log('type: ', PriceTypes[ctype]);
    }
  }, [user]);

  const handleChangeLS = (value) => {
    setLongShort(value);
  };

  const handleChangeViewMode = (event, value) => {
    setViewMode(value);
  };

  const handleSlider = (e) => {
    const { value } = e.target;
    //setSliderValue(value);
    console.log('handleSlider:', value);
    const direction = value >= sliderValue ? true : false;
    let _value = 0;
    for (let i = 0; i < MIN_MAX[ctype].values.length; i++) {
      if (MIN_MAX[ctype].values[i] >= value) {
        if (direction) _value = MIN_MAX[ctype].values[i];
        else _value = MIN_MAX[ctype].values[i - 1];
        break;
      }
    }
    console.log('handleValue', _value);
    if(_value > 0)
      setSliderValue(_value);
  };

  const handleSliderLoseValue = (e) => {
    const { value } = e.target;
    setSliderLoseValue(value);
  };

  const handleSliderProfitValue = (e) => {
    const { value } = e.target;
    setSliderProfitValue(value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeMarket = (type) => {
    setMarketLimit(type);
    handleClose();
  };

  const handChangeShowLoseSliderBar = () => {
    setShowLoseSildeBar(!showLoseSlideBar);
  };

  const handChangeShowProfitSliderBar = () => {
    setShowProfitSildeBar(!showProfitSlideBar);
  };

  const removeDecimal = (balance) => {
    const balanceAfter = balance / 10 ** 18;
    return balanceAfter;
  };

  const checkOrderType = (marketLimit, longShort) => {
    if (marketLimit == 'market' && longShort == 'long') {
      return 2;
    } else if (marketLimit == 'market' && longShort == 'short') {
      return 3;
    } else if (marketLimit == 'limit' && longShort == 'long') {
      return 0;
    } else {
      return 1;
    }
  };

  const getAccountBalance = async () => {
    let acc = await dai.methods.balanceOf(user).call();
    let accountBalance = removeDecimal(acc);
    setAccBalance(accountBalance);
  };

  const checkTPnSLInput = (price) => {
    if (price == 0) {
      return price;
    } else {
      const round = Math.round(price);
      return round * 10 ** 8;
    }
  };

  const openMarketOrder = async (pair, orderType, leverageAmount, collateral, TP, SL) => {
    await dai.methods
      .approve(vault._address, collateral)
      .send({ from: user })
      .on('transactionHash', (hash) => {
        vault.methods
          .openMarketPriceOrder(pair, orderType, leverageAmount, collateral, TP, SL)
          .send({ from: user })
          .on('transactionHash', (hash) => {
            console.log(hash);
            setTimeout(() => {
              handleSelectTab(0);
            }, 7000);
            setIsShowAlert(true); // show notification
          });
      });
  };

  const getAssetID = (currency, PriceType, CryptoList, ForexList, StockList) => {
    if (PriceType[ctype] === 'crypto') {
      for (let i = 0; i < CryptoList.length; i++) {
        if (CryptoList[i].name == currency) {
          return CryptoList[i].currencyID;
        }
      }
    } else if (PriceType[ctype] === 'forex') {
      for (let i = 0; i < ForexList.length; i++) {
        if (ForexList[i].name == currency) {
          return ForexList[i].currencyID;
        }
      }
    } else {
      for (let i = 0; i < StockList.length; i++) {
        if (StockList[i].name == currency) {
          return StockList[i].currencyID;
        }
      }
    }
  };

  return (
    <Card
      sx={{
        minWidth: 480,
        height: 'fit-content',
        [theme.breakpoints.down('md')]: { minWidth: '100%' }
      }}
    >
      <Snackbar
        isOpen={isShowAlert}
        notiType="opened"
        notiDuration={NOTIFICATION_DURATION}
        onClose={() => setIsShowAlert(false)}
        marketLimit={marketLimit}
        longShort={longShort}
        currency={pair}
      />
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <TabContainer value={viewMode} onChange={handleChangeViewMode} aria-label="basic tabs example">
            <TabStyles label="Basic" />
            <TabStyles label="Advanced" />
          </TabContainer>

          <Stack
            ref={anchorRef}
            onClick={handleOpen}
            direction="row"
            spacing={0}
            alignItems="center"
            sx={{
              position: 'relative',
              cursor: 'pointer',
              borderRadius: 1,
              [theme.breakpoints.up('md')]: {
                marginLeft: '63px !important'
              }
            }}
          >
            <Typography variant="body2">{sentenceCase(marketLimit)}</Typography>
            <img
              src="/static/icons/popup_arrow.svg"
              alt="arrow"
              style={{ position: 'absolute', bottom: 3, right: -10 }}
            />
          </Stack>

          <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1, width: 150 }}>
            <MenuItem onClick={() => handleChangeMarket('market')} sx={{ py: 1, px: 2.5 }}>
              <ListItemText>Market</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleChangeMarket('limit')} sx={{ py: 1, px: 2.5 }}>
              <ListItemText>Limit</ListItemText>
            </MenuItem>
          </MenuPopover>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleChangeLS('long')}
              sx={{
                backgroundColor: '#0E0D14',
                boxShadow: 'none',
                fontSize: '20px',
                // height: 50,
                ...(longShort === 'long'
                  ? {
                      backgroundColor: '#5600C3',
                      '&:hover': {
                        backgroundColor: '#420391d6'
                      }
                    }
                  : {
                      '&:hover': {
                        backgroundColor: '#000000'
                      }
                    })
              }}
            >
              Long
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleChangeLS('short')}
              sx={{
                backgroundColor: '#0E0D14',
                boxShadow: 'none',
                fontSize: '20px',
                // height: 50,
                ...(longShort === 'short'
                  ? {
                      backgroundColor: '#5600C3',
                      '&:hover': {
                        backgroundColor: '#420391d6'
                      }
                    }
                  : {
                      '&:hover': {
                        backgroundColor: '#000000'
                      }
                    })
              }}
            >
              Short
            </Button>
          </Stack>
        </Stack>
        <Box my={4} mx={viewMode === 1 ? 0 : 3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={viewMode === 1 ? (marketLimit === 'limit' ? 6 : 12) : 12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                {viewMode ? 'COLLATERAL' : 'PAY'}
              </Typography>
              <Box
                sx={{ display: 'flex', alignItems: 'center', px: 1, backgroundColor: '#0E0D14', borderRadius: '10px' }}
              >
                <StableCoinPopover onChangeCurrency={(cur) => console.log(cur)} />
                <TextField
                  id="outlined-start-adornment"
                  value={collateralValue}
                  onChange={(e) => setCollateralValue(e.target.value)}
                  color="primary"
                  sx={{
                    backgroundColor: '#0E0D14',
                    borderRadius: '10px',
                    height: 40,
                    '& .MuiOutlinedInput-input': {
                      padding: theme.spacing(1),
                      fontWeight: 300
                    },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                />
              </Box>
            </Grid>
            {marketLimit === 'limit' && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Entry Price
                </Typography>
                <TextField
                  fullWidth
                  id="outlined-start-adornment"
                  value={`${fCurrency(curPrice)}`}
                  sx={{
                    backgroundColor: '#0E0D14',
                    borderRadius: '10px',
                    minWidth: 100,
                    // height: 40,
                    '& .MuiOutlinedInput-input': {
                      padding: theme.spacing(1),
                      fontWeight: 500,
                      fontSize: '15px',
                      textAlign: 'center'
                    },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
        {viewMode === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Take Profit
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  backgroundColor: '#0E0D14',
                  borderRadius: '10px'
                }}
              >
                {showProfitSlideBar ? (
                  <>
                    <Typography sx={{ padding: theme.spacing(1), width: '100%', textAlign: 'left' }}>
                      {fCurrency(profit)}
                    </Typography>
                    <Typography sx={{ padding: theme.spacing(1), textAlign: 'center', color: '#05FF00' }}>
                      {sliderProfitValue}%
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ padding: theme.spacing(1), width: '100%', textAlign: 'center' }}>-</Typography>
                )}

                <img
                  src={
                    showProfitSlideBar
                      ? '/static/icons/trading_ui/trading_arrow_up_button.svg'
                      : '/static/icons/trading_ui/trading_arrow_down_button.svg'
                  }
                  alt="two arrow"
                  style={{ width: 30, height: 'auto', marginLeft: 5, cursor: 'pointer' }}
                  onClick={handChangeShowProfitSliderBar}
                />
              </Box>
              {showProfitSlideBar && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <input
                    type="range"
                    min={5}
                    max={999}
                    onChange={handleSliderProfitValue}
                    value={sliderProfitValue}
                    step={5}
                    className="range purple"
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    sx={{ marginRight: '9px !important', marginLeft: '9px !important' }}
                  >
                    {ProfitArray.map((inc, idx) => (
                      <span style={{ fontSize: '10px' }} key={idx}>
                        {inc}
                      </span>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Stop Loss
              </Typography>
              {!stopLossMode ? (
                <TextField
                  id="outlined-start-adornment"
                  value={`${fCurrency(editedLosePrice)}`}
                  onChange={(e) => setEditedLosePrice(e.target.value)}
                  sx={{
                    backgroundColor: '#0E0D14',
                    borderRadius: '10px',
                    minWidth: 100,
                    // height: 40,
                    '& .MuiOutlinedInput-input': {
                      padding: theme.spacing(1),
                      fontWeight: 500,
                      fontSize: '15px',
                      color: '#FF0000',
                      textAlign: 'center'
                    },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      backgroundColor: '#0E0D14',
                      borderRadius: '10px'
                    }}
                  >
                    {showLoseSlideBar ? (
                      <>
                        <Typography sx={{ padding: theme.spacing(1), width: '100%', textAlign: 'left' }}>
                          {fCurrency(loss)}
                        </Typography>
                        <Typography sx={{ padding: theme.spacing(1), textAlign: 'center', color: '#FF0000' }}>
                          {sliderLoseValue}%
                        </Typography>
                      </>
                    ) : (
                      <Typography sx={{ padding: theme.spacing(1), width: '100%', textAlign: 'center' }}>-</Typography>
                    )}

                    <img
                      src={
                        showLoseSlideBar
                          ? '/static/icons/trading_ui/trading_arrow_up_button.svg'
                          : '/static/icons/trading_ui/trading_arrow_down_button.svg'
                      }
                      alt="two arrow"
                      style={{ width: 30, height: 'auto', marginLeft: 5, cursor: 'pointer' }}
                      onClick={handChangeShowLoseSliderBar}
                    />
                  </Box>
                  {showLoseSlideBar && (
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <input
                        type="range"
                        min={5}
                        max={95}
                        onChange={handleSliderLoseValue}
                        value={sliderLoseValue}
                        step={5}
                        className="range purple"
                      />
                      <Stack
                        direction="row"
                        justifyContent="space-around"
                        sx={{ marginRight: '9px !important', marginLeft: '9px !important' }}
                      >
                        {[...Array(9)].map((_, idx) => (
                          <span style={{ fontSize: '10px' }} key={idx}>
                            {(idx + 1) * 10}
                          </span>
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        )}
        <Box my={4} mx={viewMode === 1 ? 0 : 3}>
          <Box my={4} />
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            LEVERAGE MULTIPLER
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              id="outlined-start-adornment"
              onChange={(e) => setSliderValue(e.target.value)}
              value={sliderValue}
              InputProps={{
                startAdornment: <InputAdornment position="start">x</InputAdornment>
              }}
              sx={{
                backgroundColor: '#0E0D14',
                borderRadius: '10px',
                height: 40,
                maxWidth: 150,
                '& .MuiOutlinedInput-input': { padding: theme.spacing(1, 2), fontWeight: 300 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
            <Stack direction="column" spacing={0}>
              <Typography variant="caption" color="text.secondary">
                Liquidation Price:
              </Typography>
              <Typography variant="body2">{fCurrency(liqPrice)}</Typography>
            </Stack>
          </Stack>
        </Box>

        <Box my={4} />

        {/* leverage slider */}
        <input
          type="range"
          min={minMax.min}
          max={minMax.max}
          onChange={handleSlider}
          value={sliderValue}
          step={0.01}
          className="range purple"
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          {minMax.values &&
            minMax.values.map((value, idx) => (
              <span style={{ fontSize: '10px' }} key={idx}>
                {value}x
              </span>
            ))}
        </Stack>
        {/* <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Typography variant="body2">{minMax.min}x</Typography>
          <Typography variant="body2">{minMax.max}x</Typography>
        </Stack> */}
        <Box my={4} sx={{ textAlign: 'center' }}>
          {!NOT_ENOUGH_BALANCE ? (
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#5600C3',
                boxShadow: 'none',
                fontSize: '20px',
                '&:hover': {
                  backgroundColor: '#420391d6'
                }
              }}
              onClick={() => {
                openMarketOrder(
                  getAssetID(currency, PriceTypes, CryptoList, ForexList, StockList), // need to change according to pair selected
                  checkOrderType(marketLimit, longShort), // 0 - Limit Long 1 - Limit Short - 2 - Market Long 3 - Market Short
                  Math.round(sliderValue),
                  BigInt(collateralValue * 10 ** 18),
                  checkTPnSLInput(profit),
                  checkTPnSLInput(loss)
                );
              }}
            >
              {upperCase(marketLimit)} {upperCase(longShort)}
            </Button>
          ) : (
            <NotEnoughBalance>Not Enough Balance</NotEnoughBalance>
          )}
        </Box>

        <Box m={2} />
        <List>
          <ListItem sx={{ justifyContent: 'space-between !important' }}>
            <Typography variant="body2">Wallet Balance</Typography>
            <Typography variant="body2">{accBalance} DAI</Typography>
          </ListItem>
        </List>
        <Box m={1} />
        <List>
          {profitsList.map((item, index) => (
            <ListItem key={index} sx={{ justifyContent: 'space-between !important' }}>
              <Typography variant="body2">{item.name}</Typography>
              <Typography variant="body2">
                {item.name === 'Entry Price' ? fCurrency(entryPrice) : item.value}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

const NOTIFICATION_DURATION = 5000;
const NOT_ENOUGH_BALANCE = false;

const detailList = [
  {
    name: 'Buying Power',
    value: '0 DAI'
  },
  {
    name: 'Wallet Balance',
    value: '0 DAI'
  },
  {
    name: 'Position Size',
    value: '100 DAI'
  }
];

const profitsList = [
  {
    name: 'Profits in',
    value: 'DAI'
  },
  {
    name: 'Entry Price',
    value: '19,386.52'
  },
  {
    name: 'Fees',
    value: '-'
  }
];

const ProfitArray = [100, 250, 500, 750, 900];

const MIN_MAX = [
  {
    min: 1,
    max: 250,
    values: [1, 5, 10, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250]
  },
  {
    min: 1,
    max: 1000,
    values: [1, 5, 10, 25, 50, 75, 100, 200, 500, 1000]
  },
  {
    min: 1,
    max: 100,
    values: [1, 5, 10, 15, 25, 35, 50, 60, 75, 100]
  }
];

const PriceTypes = ['crypto', 'forex', 'stocks'];

export const CryptoList = [
  {
    name: 'btc',
    currencyID: 0,
    icon: '/static/icons/crypto/btc.webp'
  },
  {
    name: 'eth',
    currencyID: 1,
    icon: '/static/icons/crypto/eth.webp'
  },
  {
    name: 'ltc',
    currencyID: 2,
    icon: '/static/icons/crypto/ltc.png'
  },
  {
    name: 'xlm',
    currencyID: 3,
    icon: '/static/icons/crypto/xlm.png'
  },
  {
    name: 'ada',
    currencyID: 4,
    icon: '/static/icons/crypto/ada.webp'
  },
  {
    name: 'neo',
    currencyID: 5,
    icon: '/static/icons/crypto/neo.png'
  },
  {
    name: 'eos',
    currencyID: 6,
    icon: '/static/icons/crypto/eos.png'
  },
  {
    name: 'iot',
    currencyID: 7,
    icon: '/static/icons/crypto/iota.png'
  },
  {
    name: 'sol',
    currencyID: 8,
    icon: '/static/icons/crypto/sol.png'
  },
  {
    name: 'vet',
    currencyID: 9,
    icon: '/static/icons/crypto/vet.png'
  },
  {
    name: 'matic',
    currencyID: 10,
    icon: '/static/icons/crypto/matic.webp'
  },
  {
    name: 'dot',
    currencyID: 11,
    icon: '/static/icons/crypto/dot.png'
  },
  {
    name: 'axs',
    currencyID: 12,
    icon: '/static/icons/crypto/axs.png'
  },
  {
    name: 'uni',
    currencyID: 13,
    icon: '/static/icons/crypto/uni.png'
  },
  {
    name: 'link',
    currencyID: 14,
    icon: '/static/icons/crypto/link.png'
  },
  {
    name: 'fil',
    currencyID: 15,
    icon: '/static/icons/crypto/fil.png'
  }
];

export const ForexList = [
  {
    name: 'eur',
    currencyID: 16,
    icon: '/static/icons/forex/EU.svg'
  },
  {
    name: 'aud',
    currencyID: 17,
    icon: '/static/icons/forex/AU.svg'
  },
  {
    name: 'gbp',
    currencyID: 18,
    icon: '/static/icons/forex/GB.svg'
  },
  {
    name: 'cnh',
    currencyID: 19,
    icon: '/static/icons/forex/CN.svg'
  },
  {
    name: 'jpy',
    currencyID: 20,
    icon: '/static/icons/forex/JP.svg'
  },
  {
    name: 'mxn',
    currencyID: 21,
    icon: '/static/icons/forex/MX.svg'
  }
];

export const StockList = [
  {
    name: 'tsla',
    currencyID: 22,
    icon: '/static/icons/stocks/tesla.svg'
  },
  {
    name: 'aapl',
    currencyID: 23,
    icon: '/static/icons/stocks/apple.svg'
  },
  {
    name: 'amzn',
    currencyID: 24,
    icon: '/static/icons/stocks/amazon.svg'
  },
  {
    name: 'msft',
    currencyID: 25,
    icon: '/static/icons/stocks/microsoft.svg'
  },
  {
    name: 'snap',
    currencyID: 26,
    icon: '/static/icons/stocks/snap.svg'
  },
  {
    name: 'axp', //need to add icons
    currencyID: 27,
    icon: ''
  },
  {
    name: 'csco',
    currencyID: 28,
    icon: '/static/icons/stocks/cisco.svg'
  },
  {
    name: 't',
    currencyID: 29,
    icon: '/static/icons/stocks/at-and-t.svg'
  },
  {
    name: 'dis',
    currencyID: 30,
    icon: '/static/icons/stocks/walt-disney.svg'
  },
  {
    name: 'abbv',
    currencyID: 31,
    icon: '/static/icons/stocks/abbvie.svg'
  },
  {
    name: 'mmm',
    currencyID: 32,
    icon: ''
  },
  {
    name: 'jpm',
    currencyID: 33,
    icon: '/static/icons/stocks/jpmorgan-chase.svg'
  },
  {
    name: 'jnj',
    currencyID: 34,
    icon: '/static/icons/stocks/johnson-and-johnson.svg'
  }
];
