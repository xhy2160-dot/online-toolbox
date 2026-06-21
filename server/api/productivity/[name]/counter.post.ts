// server/api/productivity/[name]/counter.post.ts
import { sql } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tools } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {

    const rawName = getRouterParam(event, 'name')

    if (!rawName) {
        throw createError({ statusCode: 400, message: 'Missing tool name' })
    }

    // decode URL encoding (e.g. %20 -> space) and trim, then lowercase
    const name = decodeURIComponent(rawName).trim().toLowerCase()

    await db
        .update(tools)
        .set({ clicks: sql`${tools.clicks} + 1` })
        .where(sql`LOWER(${tools.name}) = ${name}`)

    const updated = await db
        .select()
        .from(tools)
        .where(sql`LOWER(${tools.name}) = ${name}`)

    if (!updated[0]) {
        throw createError({ statusCode: 404, message: 'Tool not found' })
    }

    return updated[0]
})