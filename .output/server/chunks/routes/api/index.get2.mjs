import { c as defineEventHandler } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const WATCHLIST = ["VTI", "VEA", "VWO", "VEQT", "XEQT", "VXC", "XEF"];
const index_get = defineEventHandler(async () => {
  const quotes = await Promise.all(
    WATCHLIST.map(async (ticker) => {
      const data = await $fetch("https://finnhub.io/api/v1/quote", {
        query: {
          symbol: ticker,
          token: process.env.FINNHUB_API_KEY
        }
      });
      return {
        ticker,
        price: data.c,
        // current price
        change: data.d,
        // change in $
        changePercent: data.dp,
        // change in %
        high: data.h,
        low: data.l,
        open: data.o
      };
    })
  );
  return quotes;
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
