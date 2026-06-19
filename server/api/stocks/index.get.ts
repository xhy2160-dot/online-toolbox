// server/api/stock/index.get.ts
const WATCHLIST = ['VTI', 'VEA', 'VWO', 'VEQT', 'XEQT', 'VXC', 'XEF']

export default defineEventHandler(async () => {
    const quotes = await Promise.all(
        WATCHLIST.map(async (ticker) => {
            const data: any = await $fetch('https://finnhub.io/api/v1/quote', {
                query: {
                    symbol: ticker,
                    token: process.env.FINNHUB_API_KEY,
                }
            })
            return {
                ticker,
                price: data.c,           // current price
                change: data.d,          // change in $
                changePercent: data.dp,  // change in %
                high: data.h,
                low: data.l,
                open: data.o,
            }
        })
    )
    return quotes
})