/* eslint-disable */
import { upperCase } from 'change-case-all';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Box, Stack, Typography } from '@material-ui/core';

// components
import CryptoPopover from './CryptoPopover';
import IntervalPopover from './IntervalPopover';

// utils
import { fCurrency, fNumber, fData } from '../../../utils/formatNumber';

ChartStatus.propTypes = {
  socket: PropTypes.object,
  currency: PropTypes.string,
  chartViewMode: PropTypes.number,
  lastPrice: PropTypes.object,
  onChartCurrency: PropTypes.func,
  onChartInterval: PropTypes.func,
  onCType: PropTypes.func,
  other: PropTypes.object
};

function ChartStatus({ socket, currency, chartViewMode, lastPrice, onChartCurrency, onChartInterval, onCType, other }) {
  const { close, high, low } = lastPrice;
  const theme = useTheme();
  const [interval, setInterval] = useState(1);
  const [type, setType] = useState(0);

  const [price, setPrice] = useState(0);
  const [currencyDetail, setCurrencyDetail] = useState(null);

  useEffect(() => {
    if (close) {
      setPrice(close.toFixed(3));
    }
  }, [close]);

  useEffect(() => {
    // onChartCurrency(currency);
    onChartInterval(interval);
    onCType(type);

    let pairString = '';

    if (PriceTypes[type] === 'crypto') pairString = `${currency.toUpperCase()}-USD`;
    else if (PriceTypes[type] === 'forex') pairString = `${currency.toUpperCase()}/USD`;
    else pairString = `${currency.toUpperCase()}`;

    const handler = (t) => {
      let closePrice = 0;
      let pair = '';
      if (PriceTypes[type] === 'crypto') {
        closePrice = t.p;
        pair = t.pair;
      } else if (PriceTypes[type] === 'forex') {
        closePrice = t.a;
        pair = t.p;
      } else {
        closePrice = (t.ap + t.bp) / 2;
        pair = t.sym;
      }
      try {
        if (pair === pairString) setPrice(closePrice.toFixed(3));
      } catch (e) {
        /* Error hanlding codes */
      }
    };

    socket.on(`${PriceTypes[type]}_trade_data`, handler);

    return () => {
      socket.off(`${PriceTypes[type]}_trade_data`, handler);
    };
  }, [currency, interval, type]);
  return (
    <Box {...other}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ width: '100%', mb: 2 }}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={0} alignItems="center">
          <Stack direction="row" spacing={0} alignItems="center" sx={{ [theme.breakpoints.down('md')]: { mb: 1 } }}>
            <Stack
              direction="row"
              spacing={0}
              alignItems="center"
              sx={{
                pl: 1,
                borderRadius: 1
              }}
            >
              <Typography variant="h4">{currency ? upperCase(currency) : 'BTC'}</Typography>
              <img
                src={
                  currencyDetail?.changes > 0
                    ? '/static/icons/trading_ui/two_up_arrow.svg'
                    : '/static/icons/trading_ui/two_down_arrow.svg'
                }
                alt="two arrow"
                style={{ width: 18, margin: '0 5px' }}
              />
              <Typography
                variant="h6"
                sx={{ color: currencyDetail?.changes > 0 ? '#05FF00' : '#FF0000', minWidth: 100 }}
              >
                {fCurrency(price)}
              </Typography>
            </Stack>

            <CryptoPopover
              currency={currency}
              onChnageCurrencyDetail={(detail) => setCurrencyDetail(detail)}
              onChangeCurrency={(cur) => onChartCurrency(cur)}
              onChangeType={(type) => setType(type)}
            />
          </Stack>

          <Typography variant="caption">
            24h Volume: 234M &nbsp;&nbsp;&nbsp; H: <span style={{ color: '#05FF00' }}>{high}</span> &nbsp;&nbsp;L:&nbsp;
            <span style={{ color: '#FF0000' }}>{low}</span>
          </Typography>
          {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack alignItems="center">
              <Typography variant="caption">24h Volume:</Typography>
              <Typography variant="caption">234M</Typography>
            </Stack>
            <Stack alignItems="center">
              <Typography variant="caption">High:</Typography>
              <Typography variant="caption" sx={{ color: '#05FF00' }}>
                {high}
              </Typography>
            </Stack>
            <Stack alignItems="center">
              <Typography variant="caption">Low:</Typography>
              <Typography variant="caption" sx={{ color: '#FF0000' }}>
                {low}
              </Typography>
            </Stack>
          </Stack> */}
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ [theme.breakpoints.down('md')]: { display: 'none' } }}
        >
          <IntervalPopover interval={interval} onChangeInterval={(interval) => setInterval(interval)} />
          <img src="/static/icons/trading_ui/setting_button.png" alt="two arrow" style={{ height: 40 }} />
        </Stack>
      </Stack>

      {chartViewMode === 1 && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ backgroundColor: '#232133', p: 1, pr: 3, borderRadius: '5px' }}
        >
          <Stack direction="row" spacing={2}>
            <img src="/static/icons/trading_ui/pen.png" alt="two arrow" style={{ height: 28 }} />
            <img src="/static/icons/trading_ui/plus_icon.png" alt="two arrow" style={{ height: 26 }} />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">Views</Typography>
            <Typography variant="body2">Studies</Typography>
            <img src="/static/icons/trading_ui/setting_icon.png" alt="setting_icon" style={{ height: 18 }} />
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

export default ChartStatus;

const PriceTypes = ['crypto', 'forex', 'stocks'];
