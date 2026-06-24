import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { stocks } from '~~/server/db/schema'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
    // 1. Fetch user session to identify who is making the request
    const session = await getUserSession(event)
    const uid = session.user?.id

    if (!uid) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized. Please log in to view your watchlist.'
        })
    }

    // 2. Fix select syntax to fetch all tracked tickers for this user
    const watchlist = await db.select({ ticker: stocks.ticker })
        .from(stocks)
        .where(eq(stocks.userId, uid))

    const config = useRuntimeConfig()
    const apiKey = config.finnhubApiKey || process.env.FINNHUB_API_KEY

    // 3. Map over the objects safely and fetch third-party live quotes
    const quotes = await Promise.all(
        watchlist.map(async (row) => {
            const tickerSymbol = row.ticker

            try {
                const data: any = await $fetch('https://finnhub.io/api/v1/quote', {
                    query: {
                        symbol: tickerSymbol,
                        token: apiKey,
                    }
                })

                return {
                    ticker: tickerSymbol,
                    price: data.c,           // current price
                    change: data.d,          // change in $
                    changePercent: data.dp,  // change in %
                    high: data.h,
                    low: data.l,
                    open: data.o,
                }
            } catch (fetchErr) {
                // Return structured fallback parameters if an individual ticker API check errors out
                return {
                    ticker: tickerSymbol,
                    price: 0,
                    change: 0,
                    changePercent: 0,
                    high: 0,
                    low: 0,
                    open: 0,
                    error: true
                }
            }
        })
    )

    return quotes
})