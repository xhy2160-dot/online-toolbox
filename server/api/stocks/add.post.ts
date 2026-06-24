// server/api/auth/signup.post.ts
import { eq, and } from 'drizzle-orm'
import { db } from '~~/server/db'
import { stocks } from '~~/server/db/schema'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const uid = body.uid
    const ticker = body.ticker?.trim()


    if (!uid || !ticker) {
        throw createError({ statusCode: 400, message: 'Username and ticker are required' })
    }

    // 1. Check for duplicates
    const existing = await db.select()
        .from(stocks)
        .where(and(eq(stocks.ticker, ticker), eq(stocks.userId, uid)))
        .limit(1)

    if (existing.length > 0) {
        throw createError({ statusCode: 409, message: 'Ticker is already in the watchlist' })
    }

    try {
        // 2. Execute standard MySQL Insert (No .returning() block)
        await db.insert(stocks).values({
            ticker,
            userId:uid,
        })

        return true

    } catch (err: any) {
        console.error("Critical Signup Process Failure:", err.message || err)
        throw createError({
            statusCode: err.statusCode || 500,
            message: err.message || 'Internal registration exception occurred.'
        })
    }
})