import { eq, and } from 'drizzle-orm'
import { db } from '~~/server/db'
import { stocks } from '~~/server/db/schema'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const tickerName = body.ticker?.trim().toUpperCase()
    const uid = body.uid

    if (!tickerName || !uid) {
        throw createError({
            statusCode: 400,
            message: 'Ticker and uid parameters are required.'
        })
    }

    try {
        // 3. Execute the deletion using both ticker and userId for security
        const result = await db.delete(stocks)
            .where(
                and(
                    eq(stocks.ticker, tickerName),
                    eq(stocks.userId, uid)
                )
            )

        // 4. Return success status
        return {
            success: true,
            message: `Successfully removed ${tickerName} from your watchlist.`
        }

    } catch (err: any) {
        console.error("Watchlist Deletion Failure:", err.message || err)
        throw createError({
            statusCode: 500,
            message: 'Internal server error while removing stock.'
        })
    }
})