import axios from 'axios';

const AuthStr = '1ipWpOtJ0MyGTnMppG9sLWdW6mCxdtwe';

export async function getPreviousChartData(currency, interval, type, startTime, lastTime) {
  let currencyString = 'X:BTCUSD';
  const intervalNumber = interval.split(' ')[0];
  const intervalUnit = interval.split(' ')[1] === 'min' ? 'minute' : interval.split(' ')[1];
  if (type === 'crypto') currencyString = `X:${currency?.toUpperCase()}USD`;
  else if (type === 'forex') currencyString = `C:${currency?.toUpperCase()}USD`;
  else currencyString = currency?.toUpperCase();

  const API_URL = `${process.env.REACT_APP_POLYGON_API_URL}/v2/aggs/ticker/${currencyString}/range/${intervalNumber}/${intervalUnit}/${startTime}/${lastTime}?adjusted=true&sort=asc&apiKey=${AuthStr}`;
  const response = await axios.get(API_URL);
  return response?.data?.results;
}

export async function getPreviousStocksData() {
  const response = await axios.get(
    `/v2/aggs/ticker/AAPL/range/1/minute/2022-11-20/2022-11-22?adjusted=true&sort=asc&apiKey=${AuthStr}`
  );
  return response?.data?.results;
}

// eur, aud, gbp, cnh, jpy, mxn
