import { io } from 'socket.io-client';
// eslint-disable-next-line import/extensions
import { parseFullSymbol } from './helpers.js';

const ENDPOINT = process.env.REACT_APP_WS_API_URL;
const socket = io(`${ENDPOINT}`);

const channelToSubscription = new Map();

const PriceTypes = ['crypto', 'forex', 'stocks'];

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
  if (subscriptionItem === undefined) {
    return;
  }
  const { lastDailyBar, resolution } = subscriptionItem;
  const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time, resolution);
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
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
});
socket.on(`${PriceTypes[1]}_trade_data`, (data) => {
  const exchange = PriceTypes[1];
  const fromSymbol = data.p.split('/')[0];
  const toSymbol = data.p.split('/')[1];
  // const tradePrice = parseFloat(data.p);
  const tradeTime = parseInt(data.t, 10);
  const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
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
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
});
socket.on(`${PriceTypes[2]}_trade_data`, (data) => {
  const exchange = PriceTypes[2];
  const stocksTime = parseInt(data.t, 10);
  const channelString = `0~${exchange}~${data.sym}`;
  const subscriptionItem = channelToSubscription.get(channelString);
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
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
});

socket.on(`${PriceTypes[0]}_ohlc_data`, (data) => {});
socket.on('m', (data) => {
  console.log('[socket] Message:', data);
  const [eventTypeStr, exchange, fromSymbol, toSymbol, , , tradeTimeStr, , tradePriceStr] = data.split('~');

  if (parseInt(eventTypeStr, 10) !== 0) {
    // skip all non-TRADE events
    return;
  }
  const tradePrice = parseFloat(tradePriceStr);
  const tradeTime = parseInt(tradeTimeStr, 10);
  const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
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
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
});

function getNextDailyBarTime(barTime, resolution) {
  console.log('getNextDailyBarTime');
  console.log(resolution);
  console.log(barTime);
  const date = new Date(barTime * 1000);
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
      date.setDate(date.getMonth() + 1);
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

  return date.getTime() / 1000;
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
    socket.emit('SubAdd', { subs: [channelString] });
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
    socket.emit('SubAdd', { subs: [channelString] });
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
        socket.emit('SubRemove', { subs: [channelString] });
        channelToSubscription.delete(channelString);
      }
    }
  });
}
