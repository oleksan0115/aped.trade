/* eslint-disable */
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
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
  Grid
} from '@material-ui/core';

import StableCoinPopover from './StableCoinPopover';

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
  const [viewMode, setViewMode] = useState(1);
  const [sliderValue, setSliderValue] = useState(25.0);
  const [longShort, setLongShort] = useState('long');

  const [minMax, setMinMax] = useState({});

  const [cPrice, setCPrice] = useState(0);
  // const [currency, setCurrency] = useState('btc');
  const [curPrice, setCurPrice] = useState(0);

  const [entryPrice, setEntryPrice] = useState(0);

  const [collateralValue, setCollateralValue] = useState(27.59);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [liqPrice, LiqPrice] = useState(0);

  useEffect(() => {
    setMinMax(MIN_MAX);
    onChartViewMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    setEntryPrice(cPrice);
    if (cPrice) {
      const pf = Number(cPrice) + collateralValue * 9;
      const ls = Number(cPrice) - collateralValue * 0.9;
      setProfit(pf.toFixed(3));
      setLoss(ls.toFixed(3));
      setCurPrice(cPrice);
    }
  }, [cPrice, collateralValue, currency]);

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
          <Typography variant="body2">Market</Typography>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleChangeLS('long')}
              sx={{
                backgroundColor: '#0E0D14',
                boxShadow: 'none',
                height: 50,
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
                height: 50,
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
          {viewMode === 1 && (
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                id="outlined-start-adornment"
                value={`${curPrice}`}
                sx={{
                  backgroundColor: '#0E0D14',
                  borderRadius: '10px',
                  minWidth: 90,
                  height: 40,
                  '& .MuiOutlinedInput-input': { padding: theme.spacing(1.5, 2), fontWeight: 300, fontSize: 12 },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              />

              <TextField
                id="outlined-start-adornment"
                value={`+$${profit}`}
                color="primary"
                sx={{
                  backgroundColor: '#0E0D14',
                  borderRadius: '10px',
                  minWidth: 100,
                  color: 'red',
                  height: 40,
                  '& .MuiOutlinedInput-input': {
                    padding: theme.spacing(1.5, 2),
                    fontWeight: 300,
                    fontSize: 12,
                    color: theme.palette.primary.light
                  },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              />
            </Stack>
          )}
        </Stack>
        <Box my={4} mx={viewMode === 1 ? 0 : 3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={viewMode === 1 ? 5 : 12}>
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
            {viewMode === 1 && (
              <Grid item xs={12} md={7}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Stop Loss
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    id="outlined-start-adornment"
                    value={`${curPrice}`}
                    sx={{
                      backgroundColor: '#0E0D14',
                      borderRadius: '10px',
                      minWidth: 90,
                      height: 40,
                      '& .MuiOutlinedInput-input': { padding: theme.spacing(1.5, 2), fontWeight: 300, fontSize: 12 },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  />

                  <TextField
                    id="outlined-start-adornment"
                    value={`-$${loss}`}
                    color="primary"
                    sx={{
                      backgroundColor: '#0E0D14',
                      borderRadius: '10px',
                      minWidth: 100,
                      color: 'red',
                      height: 40,
                      '& .MuiOutlinedInput-input': {
                        padding: theme.spacing(1.5, 2),
                        fontWeight: 300,
                        fontSize: 12,
                        color: theme.palette.error.main
                      },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  />
                  {/* <TextField
                    id="outlined-start-adornment"
                    value={`${curPrice}`}
                    sx={{
                      backgroundColor: '#0E0D14',
                      borderRadius: '10px',
                      maxWidth: 105,
                      height: 40,
                      '& .MuiOutlinedInput-input': { padding: theme.spacing(1.5, 2), fontWeight: 300, fontSize: 12 },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  />

                  <TextField
                    id="outlined-start-adornment"
                    value={`-$${loss}`}
                    color="primary"
                    sx={{
                      backgroundColor: '#0E0D14',
                      borderRadius: '10px',
                      maxWidth: 100,
                      height: 40,
                      '& .MuiOutlinedInput-input': {
                        padding: theme.spacing(1.5, 2),
                        fontWeight: 300,
                        fontSize: 12,
                        color: theme.palette.error.main
                      },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  /> */}
                </Stack>
              </Grid>
            )}
          </Grid>
          <Box my={4} />
          <Typography variant="body2" sx={{ mb: 1 }}>
            LEVERAGE MULTIPLER
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              id="outlined-start-adornment"
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
              <Typography variant="body2">{liqPrice}</Typography>
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
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Typography variant="body2">1x</Typography>
          <Typography variant="body2">1000x</Typography>
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
            MARKET {longShort.toUpperCase()}
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
              <Typography variant="body2">{item.name === 'Entry Price' ? entryPrice : item.value}</Typography>
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

const MIN_MAX = {
  min: 1,
  max: 1000
};

const PriceTypes = ['crypto', 'forex', 'stocks'];
