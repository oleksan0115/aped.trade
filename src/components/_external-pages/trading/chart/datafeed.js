import { parseFullSymbol } from './helpers';
import { subscribeOnStream, unsubscribeFromStream } from '../ChartStatus';
import { getPreviousChartData, getPreviousStocksData } from '../api';
import { CRYPTOS, FOREX, STOCKS, Intervals } from './Consts';

const lastBarsCache = new Map();

let allSymbols = [];
const configurationData = {
  supported_resolutions: Intervals,
  exchanges: [
    {
      value: 'crypto',
      name: 'Crypto',
      desc: 'crypto'
    },
    {
      // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
      value: 'forex',

      // filter name
      name: 'Forex',

      // full exchange name displayed in the filter popup
      desc: 'forex'
    },
    {
      value: 'stocks',
      name: 'Stocks',
      desc: 'stocks'
    }
  ],
  symbols_types: [
    {
      name: 'crypto',

      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: 'crypto'
    },
    { name: 'forex', value: 'forex' },
    { name: 'stocks', value: 'stocks' }
    // ...
  ]
};

async function getAllSymbols() {
  const data = {
    crypto: CRYPTOS,
    forex: FOREX,
    stocks: STOCKS
  };

  // const data = {await makeApiRequest('data/v3/all/exchanges')};
  const allSymbols = [];

  configurationData.exchanges.forEach((exchange) => {
    const subData = data[exchange.value];
    if (subData)
      subData.forEach((item) => {
        allSymbols.push({
          symbol: item.label,
          full_name: `${exchange.name}:${item.label}`,
          description: item.label,
          exchange: exchange.value,
          type: exchange.value
        });
      });
  });
  return allSymbols;
}

export default {
  onReady: (callback) => {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
    const newSymbols = allSymbols.filter((symbol) => {
      const isExchangeValid = symbolType === '' || symbol.type === symbolType;
      const isFullSymbolContainsInput = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  },

  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
    try {
      const symbols = await getAllSymbols();
      allSymbols = [...symbols];
      const symbolItem = symbols.find(({ symbol }) => symbol === symbolName.split(':')[1]);
      if (!symbolItem) {
        console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
        onResolveErrorCallback('cannot resolve symbol');
        return;
      }
      const symbolInfo = {
        ticker: symbolItem.full_name,
        name: symbolItem.symbol,
        description: symbolItem.description,
        type: symbolItem.type,
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: symbolItem.exchange,
        minmov: 1,
        interval: 1,
        pricescale: 100,
        has_intraday: true,
        visible_plots_set: true,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming'
      };

      console.log('[resolveSymbol]: Symbol resolved', symbolInfo);
      onSymbolResolvedCallback(symbolInfo);
    } catch (e) {
      console.log(new Error(e));
    }
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
    if (symbolInfo.type !== 'stocks') {
      const parsedSymbol = parseFullSymbol(symbolInfo.ticker);
      console.log(resolution);
      console.log(parsedSymbol);
      try {
        getPreviousChartData(
          parsedSymbol.fromSymbol,
          resolution,
          symbolInfo.type,
          from * 1000,
          to * 1000,
          'charting_library'
        ).then((data) => {
          if (!data || data.length === 0) {
            // "noData" should be set if there is no data in the requested period.
            onHistoryCallback([], {
              noData: true
            });
            return;
          }
          console.log('previousChartData', data);
          console.log(symbolInfo.type);
          let bars = [];
          data.forEach((bar) => {
            if (bar.t >= from * 1000 && bar.t < to * 1000) {
              bars = [
                ...bars,
                {
                  time: bar.t,
                  low: bar.l,
                  high: bar.h,
                  open: bar.o,
                  close: bar.c
                }
              ];
            }
          });
          if (firstDataRequest) {
            lastBarsCache.set(symbolInfo.full_name, {
              ...bars[bars.length - 1]
            });
            console.log('bars final data');
            console.log(bars[bars.length - 1]);
          }
          console.log(`[getBars]: returned ${bars.length} bar(s)`);
          onHistoryCallback(bars, {
            noData: false
          });
        });
      } catch (e) {
        console.log(new Error(e));
      }
    } else {
      try {
        getPreviousStocksData(symbolInfo.name, resolution, from * 1000, to * 1000).then((data) => {
          if (!data || data.length === 0) {
            // "noData" should be set if there is no data in the requested period.
            onHistoryCallback([], {
              noData: true
            });
            return;
          }
          let bars = [];
          console.log('previousChartData', data);
          console.log(symbolInfo.type);
          data.forEach((bar) => {
            if (bar.t >= from * 1000 && bar.t < to * 1000) {
              bars = [
                ...bars,
                {
                  time: bar.t,
                  low: bar.l,
                  high: bar.h,
                  open: bar.o,
                  close: bar.c
                }
              ];
            }
          });
          if (firstDataRequest) {
            lastBarsCache.set(symbolInfo.full_name, {
              ...bars[bars.length - 1]
            });
          }
          console.log(`[getBars]: returned ${bars.length} bar(s)`);
          onHistoryCallback(bars, {
            noData: false
          });
        });
      } catch (e) {
        console.log(new Error(e));
      }
    }
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name)
    );
  },

  unsubscribeBars: (subscriberUID) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    unsubscribeFromStream(subscriberUID);
  }
};
