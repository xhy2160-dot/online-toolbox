// server/api/cat/count-tools-by-cat.get.ts
import { sql } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tools } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
    try {
        // Run all three queries in parallel to drastically minimize database round-trip times
        const [allTools, totalCountResult, categoryCounts] = await Promise.all([

            // 1. Fetch all tools
            db.select().from(tools),

            // 2. Count total tools across the entire platform
            db.select({ total: sql<number>`count(*)` }).from(tools),

            // 3. Group by category and count each segment
            db.select({
                categoryId: tools.catId,
                count: sql<number>`count(*)`
            })
                .from(tools)
                .groupBy(tools.catId)
        ])

        // Extract the raw integer from the single-row count result
        const totalTools = totalCountResult[0]?.total || 0

        return {
            totalTools,
            categoryCounts,
            tools: allTools
        }

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database query failed'
        })
    }
})