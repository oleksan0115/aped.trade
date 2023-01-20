/* eslint-disable */
import { sentenceCase, upperCase } from 'change-case-all';
import PropTypes from 'prop-types';

import React, { useEffect, useState, useRef } from 'react';
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

// hooks
import useSettings from '../../../hooks/useSettings';

// utils
import { fCurrency } from '../../../utils/formatNumber';

import { getPreviousChartData } from './api';

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

LongShort.propTypes = {
  currency: PropTypes.string,
  ctype: PropTypes.number,
  onChartViewMode: PropTypes.func,
  socket: PropTypes.object
};
export default function LongShort({ currency, ctype, onChartViewMode, socket }) {
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

  const [minMax, setMinMax] = useState({});

  const [cPrice, setCPrice] = useState(0);
  const [curPrice, setCurPrice] = useState(0);

  const [entryPrice, setEntryPrice] = useState(0);

  const [collateralValue, setCollateralValue] = useState(27.59);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [liqPrice, LiqPrice] = useState(0);

  useEffect(() => {
    setMinMax(MIN_MAX[ctype]);
    onChartViewMode(viewMode);
  }, [viewMode, ctype]);

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

    getPreviousChartData(currency, 1, PriceTypes[ctype], startTime, lastTime).then((pastData) => {
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

  const handleChangeLS = (value) => {
    setLongShort(value);
  };

  const handleChangeViewMode = (event, value) => {
    setViewMode(value);
  };

  const handleSlider = (e) => {
    const { value } = e.target;
    setSliderValue(value);
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
  return (
    <Card
      sx={{
        minWidth: 480,
        [theme.breakpoints.down('md')]: { minWidth: '100%' }
      }}
    >
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
              pl: 4,
              borderRadius: 1
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
              <Typography variant="body2" sx={{ mb: 1 }}>
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
                <Typography variant="body2" sx={{ mb: 1 }}>
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
              <Typography variant="body2" sx={{ mb: 1 }}>
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
                    min={25}
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
              <Typography variant="body2" sx={{ mb: 1 }}>
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
          <Typography variant="body2" sx={{ mb: 1 }}>
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
        {/* <Stack direction="row" justifyContent="space-between">
          {minMax.values && minMax.values.map((value, idx) => <span key={idx}>{value}</span>)}
        </Stack> */}
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Typography variant="body2">{minMax.min}x</Typography>
          <Typography variant="body2">{minMax.max}x</Typography>
        </Stack>
        <Box my={4} sx={{ textAlign: 'center' }}>
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
          >
            {upperCase(marketLimit)} {upperCase(longShort)}
          </Button>
        </Box>

        <Box m={2} />
        <List>
          {detailList.map((item, index) => (
            <ListItem key={index} sx={{ justifyContent: 'space-between !important' }}>
              <Typography variant="body2">{item.name}</Typography>
              <Typography variant="body2">{item.value}</Typography>
            </ListItem>
          ))}
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
const detailList = [
  {
    name: 'Buying Power',
    value: '0 DAI'
  },
  {
    name: 'Wallet Balance',
    value: '0 DAI'
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
    values: [1, 5, 10, 25, 50, 75, 100, 150, 200, 250]
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
