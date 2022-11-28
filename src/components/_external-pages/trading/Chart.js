import React, { useEffect } from 'react';
import { createChart } from 'lightweight-charts';
import { io } from 'socket.io-client';
import moment from 'moment';

import { getPreviousCryptoData } from './api';

const ENDPOINT = 'http://127.0.0.1:8080';
const socket = io(ENDPOINT);
const chart = createChart(document.body, {
  height: 450,
  width: 900
});
const areaSeries = chart.addAreaSeries();

export default function Chart() {
  useEffect(() => {
    getPreviousCryptoData().then((pastData) => {
      const formattedData = pastData.map((d) => {
        const currentDate = new Date();
        const mil = currentDate.getTimezoneOffset();
        const time = new Date(d.t).getTime() / 1000 - mil * 60;
        return {
          ...d,
          time,
          value: d.p,
          format: moment.unix(d.t / 1000).format('MM/DD/YYYY HH:mm:ss')
        };
      });
      formattedData.map((f) => areaSeries.update(f));
      console.log(formattedData);
    });

    socket.on('trade_data', (t) => {
      try {
        const currentDate = new Date();
        const mil = currentDate.getTimezoneOffset();
        const time = new Date(t.t).getTime() / 1000 - mil * 60;
        console.log(t);
        areaSeries.update({ time, value: t.p });
      } catch (e) {
        /* Error hanlding codes */
      }
    });
  }, []);
  return (
    <div>
      <h1>Crypto Trade Statistics</h1>
    </div>
  );
}
