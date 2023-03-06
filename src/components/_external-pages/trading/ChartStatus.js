/* eslint-disable */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Box, Stack, Typography } from '@material-ui/core';

// components
import CryptoPopover from './CryptoPopover';
import IntervalPopover from './IntervalPopover';
import { parseFullSymbol } from './chart/helpers';
import { PriceTypes } from './chart/Consts';
import { ConstructionOutlined } from '@material-ui/icons';
const channelToSubscription = new Map();

ChartStatus.propTypes = {
  socket: PropTypes.object,
  currency: PropTypes.string,
  ctype: PropTypes.number,
  interval: PropTypes.string,
  chartViewMode: PropTypes.number,
  lastPrice: PropTypes.object,
  lastOHLCData: PropTypes.object,
  onChartCurrency: PropTypes.func,
  onChartInterval: PropTypes.func,
  other: PropTypes.object
};

function ChartStatus({
  socket,
  currency,
  ctype,
  interval,
  chartViewMode,
  lastPrice,
  lastOHLCData,
  onChartCurrency,
  onChartInterval,
  other
}) {
  const { close, open, high, low } = lastPrice;
  const theme = useTheme();

  const [price, setPrice] = useState(0);
  const [openPrice, setOpenPrice] = useState(0);
  useEffect(() => {
    socket.on('connect', () => {
      console.log('[socket] Connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('[socket] Disconnected:', reason);
    });

    socket.on('error', (error) => {
      console.log('[socket] Error:', error);
    });

    socket.on(`${PriceTypes[0]}_trade_data`, (data) => {
      const exchange = PriceTypes[0];
      const fromSymbol = data.pair.split('-')[0];
      const toSymbol = data.pair.split('-')[1];
      const tradePrice = parseFloat(data.p);
      const tradeTime = parseInt(data.t, 10);
      const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
      const subscriptionItem = channelToSubscription.get(channelString);
      console.log("crypto_trade_data");
      console.log(ctype, currency, fromSymbol, toSymbol);
      // real time show the price in CryptoPopover
      if (ctype === 0 && fromSymbol === currency.toUpperCase() && toSymbol === 'USD') {
        setPrice(Number(tradePrice.toFixed(3)));
      }

      if (subscriptionItem === undefined) {
        return;
      }
      const { lastDailyBar, resolution } = subscriptionItem;
      const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time, resolution);
      console.log("socekt bar time check: ");
      console.log(tradeTime);
      console.log(lastDailyBar.time);
      console.log(nextDailyBarTime);
      let bar;
      if (tradeTime >= nextDailyBarTime) {
        bar = {
          time: nextDailyBarTime,
          open: tradePrice,
          high: tradePrice,
          low: tradePrice,
          close: tradePrice
        };
        console.log('[socket] Generate new bar', bar);
      } else {
        bar = {
          ...lastDailyBar,
          high: Math.max(lastDailyBar.high, tradePrice),
          low: Math.min(lastDailyBar.low, tradePrice),
          close: tradePrice
        };
        console.log('[socket] Update the latest bar by price', tradePrice);
      }

      // assess if the price is increasing or decreasing for CryptoPopover
      setOpenPrice(subscriptionItem.lastDailyBar.open);

      subscriptionItem.lastDailyBar = bar;

      // send data to every subscriber of that symbol
      subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
    });
    socket.on(`${PriceTypes[1]}_trade_data`, (data) => {
      const exchange = PriceTypes[1];
      const fromSymbol = data.p.split('/')[0];
      const toSymbol = data.p.split('/')[1];
      const tradeTime = parseInt(data.t, 10);
      const tradePrice = parseFloat(data.p);
      const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;

      // real time show the price in CryptoPopover
      if (ctype === 1 && fromSymbol === currency.toUpperCase() && toSymbol === 'USD') {
        setPrice(Number(tradePrice.toFixed(3)));
      }
      const subscriptionItem = channelToSubscription.get(channelString);
      if (subscriptionItem === undefined) {
        return;
      }

      const { lastDailyBar, resolution } = subscriptionItem;
      const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time, resolution);
      let bar;
      if (tradeTime >= nextDailyBarTime) {
        bar = {
          time: nextDailyBarTime,
          open: data.a,
          high: data.a,
          low: data.b,
          close: data.b
        };
        console.log('[socket] Generate new bar', bar);
      } else {
        bar = {
          ...lastDailyBar,
          high: Math.max(lastDailyBar.high, data.a),
          low: Math.min(lastDailyBar.low, data.b),
          close: data.b
        };
        console.log('[socket] Update the latest bar by price', data.b);
      }
      // assess if the price is increasing or decreasing for CryptoPopover
      setOpenPrice(subscriptionItem.lastDailyBar.open);

      subscriptionItem.lastDailyBar = bar;

      // send data to every subscriber of that symbol
      subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
    });
    socket.on(`${PriceTypes[2]}_trade_data`, (data) => {
      const exchange = PriceTypes[2];
      const stocksTime = parseInt(data.t, 10);
      const channelString = `0~${exchange}~${data.sym}`;
      const subscriptionItem = channelToSubscription.get(channelString);
      const tradePrice = parseFloat(data.ap);
      if (ctype === 2 && data.sym === currency.toUpperCase()) {
        setPrice(Number(tradePrice.toFixed(3)));
      }
      if (subscriptionItem === undefined) {
        return;
      }
      const { lastDailyBar, resolution } = subscriptionItem;
      const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time, resolution);

      let bar;
      if (stocksTime >= nextDailyBarTime) {
        bar = {
          time: nextDailyBarTime,
          open: data.ap,
          high: data.ap,
          low: data.bp,
          close: data.bp
        };
        console.log('[socket] Generate new bar', bar);
      } else {
        bar = {
          ...lastDailyBar,
          high: Math.max(lastDailyBar.high, data.ap),
          low: Math.min(lastDailyBar.low, data.bp),
          close: data.bp
        };
        console.log('[socket] Update the latest bar by price', data.bp);
      }
      setOpenPrice(subscriptionItem.lastDailyBar.open);
      subscriptionItem.lastDailyBar = bar;

      // send data to every subscriber of that symbol
      subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
    });
    return () => {
      socket.off(`${PriceTypes[0]}_trade_data`);
      socket.off(`${PriceTypes[1]}_trade_data`);
      socket.off(`${PriceTypes[2]}_trade_data`);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
    };
  }, [currency]);
  useEffect(() => {
    if (close) {
      setOpenPrice(open);
      setPrice(Number(close.toFixed(3)));
    }
  }, [close, open]);

  useEffect(() => {
    if (lastOHLCData) {
      const { open } = lastOHLCData;
      setOpenPrice(open);
    }
  }, [lastOHLCData]);

  useEffect(()=>{
    setPrice(0);
  },[currency, ctype])

  return (
    <Box {...other}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          width: '100%',
          py: 1,
          backgroundColor: '#0D0C17',
          [theme.breakpoints.down('md')]: { position: 'fixed', top: 56, left: 0, width: '100%', zIndex: 1000 }
        }}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={0} alignItems="center">
          <Stack direction="row" spacing={0} alignItems="center" sx={{ [theme.breakpoints.down('md')]: { mb: 1 } }}>
            <CryptoPopover
              price={price}
              openPrice={openPrice}
              currency={currency}
              onChangeCurrency={(cur, priceType) => {
                setPrice(0);
                onChartCurrency(cur, priceType);
              }}
            />
          </Stack>

          <Typography variant="caption">
            24h Volume: 234M &nbsp;&nbsp;&nbsp; H: <span style={{ color: '#05FF00' }}>{high}</span> &nbsp;&nbsp;L:&nbsp;
            <span style={{ color: '#FF0000' }}>{low}</span>
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ [theme.breakpoints.down('md')]: { display: 'none' } }}
        >
          <IntervalPopover interval={interval} onChangeInterval={(_interval) => onChartInterval(_interval)} />
          <img src="/static/icons/trading_ui/setting_button.png" alt="two arrow" style={{ height: 40 }} />
        </Stack>
      </Stack>

      {chartViewMode === 1 && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: '#232133',
            p: 1,
            pr: 3,
            borderRadius: '5px',
            [theme.breakpoints.down('md')]: { marginTop: '70px' }
          }}
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

function getNextDailyBarTime(barTime, resolution) {
  console.log('getNextDailyBarTime');
  console.log(resolution);
  console.log(barTime);
  const date = new Date(barTime);
  console.log(date);
  console.log(date.getTime());
  switch (resolution) {
    case '1D':
      date.setDate(date.getDate() + 1);
      break;
    case '1W':
      date.setDate(date.getDate() + 7);
      break;
    case '1M':
      date.setMonth(date.getMonth() + 1);
      break;
    case '1':
      date.setTime(date.getTime() + 60 * 1000);
      break;
    case '5':
      date.setTime(date.getTime() + 5 * 60 * 1000);
      break;
    case '15':
      date.setTime(date.getTime() + 15 * 60 * 1000);
      break;
    case '30':
      date.setTime(date.getTime() + 30 * 60 * 1000);
      break;
    case '1H':
      date.setTime(date.getTime() + 60 * 60 * 1000);
      break;
    default:
      break;
  }
  // console.log(date);
  // console.log(date.getTime());

  return date.getTime();
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback,
  lastDailyBar
) {
  if (symbolInfo.type !== 'stocks') {
    console.log(symbolInfo.full_name);
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    console.log('streaming parsedSymbol: ', symbolInfo);
    console.log('streaming parsedSymbol: ', parsedSymbol);
    console.log(lastDailyBar);
    const channelString = `0~${symbolInfo.type}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
    const handler = {
      id: subscriberUID,
      callback: onRealtimeCallback
    };
    let subscriptionItem = channelToSubscription.get(channelString);
    if (subscriptionItem) {
      // already subscribed to the channel, use the existing subscription
      subscriptionItem.handlers.push(handler);
      return;
    }
    subscriptionItem = {
      subscriberUID,
      resolution,
      lastDailyBar,
      handlers: [handler]
    };
    channelToSubscription.set(channelString, subscriptionItem);
    console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
    //socket.emit('SubAdd', { subs: [channelString] });
  } else {
    const channelString = `0~${symbolInfo.type}~${symbolInfo.name}`;
    console.log('channelString', channelString);
    const handler = {
      id: subscriberUID,
      callback: onRealtimeCallback
    };
    let subscriptionItem = channelToSubscription.get(channelString);
    if (subscriptionItem) {
      // already subscribed to the channel, use the existing subscription
      subscriptionItem.handlers.push(handler);
      return;
    }
    subscriptionItem = {
      subscriberUID,
      resolution,
      lastDailyBar,
      handlers: [handler]
    };
    channelToSubscription.set(channelString, subscriptionItem);
    console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
    //socket.emit('SubAdd', { subs: [channelString] });
  }
}

export function unsubscribeFromStream(subscriberUID) {
  if (!channelToSubscription) return;
  const keys = channelToSubscription.keys();
  console.log('channelToSubscription', keys);
  console.log([...keys]);

  [...channelToSubscription.keys()].forEach((channelString) => {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex((handler) => handler.id === subscriberUID);

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString);
        //socket.emit('SubRemove', { subs: [channelString] });
        channelToSubscription.delete(channelString);
      }
    }
  });
}
