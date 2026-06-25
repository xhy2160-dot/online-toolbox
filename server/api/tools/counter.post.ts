// server/api/productivity/[name]/counter.post.ts
import { sql } from 'drizzle-orm'
import { db } from '#server/db'
import { tools } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const rawurl = body.url

    // decode URL encoding (e.g. %20 -> space) and trim, then lowercase
    const url = decodeURIComponent(rawurl).trim().toLowerCase()

    await db
        .update(tools)
        .set({ clicks: sql`${tools.clicks} + 1` })
        .where(sql`LOWER(${tools.url}) = ${url}`)

    const updated = await db
        .select()
        .from(tools)
        .where(sql`LOWER(${tools.url}) = ${url}`)

})