// server/api/productivity/tools.get.ts
import { desc } from 'drizzle-orm'
import { getDb } from '~~/server/db'
import { tools } from '~~/server/db/schema'

export default defineEventHandler(async () => {
    const db = getDb()
    return db
        .select()
        .from(tools)
        .orderBy(desc(tools.clicks))
        .limit(6)
})