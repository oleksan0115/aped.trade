import axios from 'axios';

const AuthStr = '1ipWpOtJ0MyGTnMppG9sLWdW6mCxdtwe';

export async function getPreviousChartData(currency, interval, type, startTime, lastTime, description) {
  console.log(description);
  console.log(type, startTime, lastTime);
  let currencyString = 'X:BTCUSD';
  let intervalNumber = 0;
  let intervalUnit = '';
  console.log(interval);
  switch (interval) {
    case '1D':
      intervalNumber = 1;
      intervalUnit = 'day';
      break;
    case '1W':
      intervalNumber = 7;
      intervalUnit = 'day';
      break;
    case '1M':
      intervalNumber = 1;
      intervalUnit = 'month';
      break;
    case '1':
      intervalNumber = 1;
      intervalUnit = 'minute';
      break;
    case '5':
      intervalNumber = 5;
      intervalUnit = 'minute';
      break;
    case '15':
      intervalNumber = 15;
      intervalUnit = 'minute';
      break;
    case '30':
      intervalNumber = 30;
      intervalUnit = 'minute';
      break;
    case '60':
      intervalNumber = 60;
      intervalUnit = 'minute';
      break;
    default:
      break;
  }
  if (type === 'crypto') currencyString = `X:${currency?.toUpperCase()}USD`;
  else if (type === 'forex') currencyString = `C:${currency?.toUpperCase()}USD`;
  else currencyString = currency?.toUpperCase();

  const API_URL = `${process.env.REACT_APP_POLYGON_API_URL}/v2/aggs/ticker/${currencyString}/range/${intervalNumber}/${intervalUnit}/${startTime}/${lastTime}?adjusted=true&sort=asc&apiKey=${AuthStr}`;
  console.log(API_URL);
  const response = await axios.get(API_URL);
  return response?.data?.results;
}

export async function getPreviousChartData1(currency, interval, type, startTime, lastTime) {
  let currencyString = 'X:BTCUSD';
  const intervalNumber = interval.split(' ')[0];
  const intervalUnit = interval.split(' ')[1] === 'min' ? 'minute' : interval.split(' ')[1];
  if (type === 'crypto') currencyString = `X:${currency?.toUpperCase()}USD`;
  else if (type === 'forex') currencyString = `C:${currency?.toUpperCase()}USD`;
  else currencyString = currency?.toUpperCase();

  const API_URL = `${process.env.REACT_APP_POLYGON_API_URL}/v2/aggs/ticker/${currencyString}/range/${intervalNumber}/${intervalUnit}/${startTime}/${lastTime}?adjusted=true&sort=asc&apiKey=${AuthStr}`;
  console.log(API_URL);
  const response = await axios.get(API_URL);
  return response?.data?.results;
}

export async function getPreviousStocksData(stockName, interval, startTime, lastTime) {
  let intervalNumber = 0;
  let intervalUnit = '';
  switch (interval) {
    case '1D':
      intervalNumber = 1;
      intervalUnit = 'day';
      break;
    case '1W':
      intervalNumber = 7;
      intervalUnit = 'day';
      break;
    case '1M':
      intervalNumber = 1;
      intervalUnit = 'month';
      break;
    case '1':
      intervalNumber = 1;
      intervalUnit = 'minute';
      break;
    case '5':
      intervalNumber = 5;
      intervalUnit = 'minute';
      break;
    case '15':
      intervalNumber = 15;
      intervalUnit = 'minute';
      break;
    case '30':
      intervalNumber = 30;
      intervalUnit = 'minute';
      break;
    case '60':
      intervalNumber = 60;
      intervalUnit = 'minute';
      break;
    default:
      break;
  }
  const API_URL = `${
    process.env.REACT_APP_POLYGON_API_URL
  }/v2/aggs/ticker/${stockName.toUpperCase()}/range/${intervalNumber}/${intervalUnit}/${startTime}/${lastTime}?adjusted=true&sort=asc&apiKey=${AuthStr}`;
  console.log(API_URL);
  const response = await axios.get(API_URL);
  return response?.data?.results;
}

// eur, aud, gbp, cnh, jpy, mxn
