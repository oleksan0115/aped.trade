/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TradingViewEmbed, widgetType } from 'react-tradingview-embed';

// materials
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { CRYPTO_COMPARE } from '../../../keys';
import { crypto } from '../../../assets/real-time.json';

// const formatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD'
// });

Chart.propTypes = {
  isLight: PropTypes.bool
};

function Chart({ isLight }) {
  const theme = useTheme();
  // const [chartData, setChartData] = useState([]);
  // const [query, setQuery] = useState('BTC');
  // const [symbol, setSymbol] = useState('');

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [currency, setCurrency] = useState('BTC');

  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    async function loadChartData(symbol) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/blockchain/histo/day?fsym=${symbol}&api_key=${CRYPTO_COMPARE}&limit=30`
      );

      const data = await response.json();
      const bulkData = data.Data.Data || [];
      const dataArray = [];
      bulkData.map((y) =>
        dataArray.push({
          x: y.time * 1000,
          y: y.transaction_count * y.average_transaction_value
        })
      );
    }
    loadChartData(currency);
  }, [currency]);

  useEffect(() => {
    const newCrypto = [];

    crypto.map((pair) => {
      const row = {
        pair,
        price: (Math.random() * 80.0 + 100).toFixed(3),
        hour: `+${(Math.random() * 1.0).toFixed(3)}%`
      };
      return newCrypto.push(row);
    });

    setCryptoData(newCrypto);
  }, []);

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  // const handleInputChange = (e) => {
  //   console.log(e);
  //   setQuery(e.target.value);
  // };
  return (
    <div className="chart">
      <div className="trading-view">
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel htmlFor="outlined-currency-native-simple">Currency</InputLabel>
          <Select
            native
            value={currency}
            onChange={handleChange}
            label="Currency"
            inputProps={{
              name: 'currency',
              id: 'outlined-currency-native-simple'
            }}
            // sx={{ fontSize: 25, '& .MuiNativeSelect-select': { padding: theme.spacing(1, 2) } }}
          >
            {cryptoData.map((row) => {
              const value = row.pair.split('/')[0];
              return (
                <option key={row.pair} value={value} style={{ fontSize: 20, margin: 10 }}>
                  {row.pair}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <TradingViewEmbed
          widgetType={widgetType.TICKER}
          widgetConfig={{
            width: '80%',
            showSymbolLogo: true,
            isTransparent: true,
            displayMode: 'adaptive',
            colorTheme: isLight ? 'light' : 'dark',
            autosize: true,
            symbols: [
              {
                proName: 'BITSTAMP:BTCUSD',
                title: 'BTC/USD'
              },
              {
                proName: 'BITSTAMP:ETHUSD',
                title: 'ETH/USD'
              },
              {
                proName: 'FX_IDC:EURUSD',
                title: 'EUR/USD'
              },
              {
                proName: 'FOREXCOM:SPXUSD',
                title: 'S&P 500'
              },
              {
                proName: 'FOREXCOM:NSXUSD',
                title: 'US 100'
              }
            ]
          }}
        />
      </div>

      <TradingViewEmbed
        widgetType={widgetType.ADVANCED_CHART}
        widgetConfig={{
          interval: '1D',
          colorTheme: isLight ? 'light' : 'dark',
          width: '100%',
          height: isDesktop ? '400px' : '670px',
          symbol: `${currency}USD`
        }}
      />

      {/* <input placeholder="Search for a symbol" onChange={(e) => handleInputChange(e)} className="dataRequest" />
      <button onClick={loadChartData} className="dataRequest">
        Load Onchain Data
      </button> */}
    </div>
  );
}

export default Chart;
