// server/api/cat/[catId]/counter.get.ts
import { desc, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tools } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
    // 1. Fix the parameter name to match the [catId] folder/filename exactly
    const catId = getRouterParam(event, 'catId')

    // Optional: Add a fail-safe check if the parameter is missing
    if (!catId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing category ID parameter'
        })
    }

    // 2. Query the database, filtering by the specific category
    const results = await db
        .select()
        .from(tools)
        .where(eq(tools.catId, Number(catId)))// Adjust 'categoryId' to match your schema's column name
        .orderBy(desc(tools.clicks))

    return results
})