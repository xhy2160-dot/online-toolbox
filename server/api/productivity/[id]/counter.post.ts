// server/api/productivity/[id]/counter.post.ts
import { eq, sql } from 'drizzle-orm'
import { db } from '#server/db'
import { tools } from '#server/db/schema'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, message: 'Missing tool id' })
    }

    await db
        .update(tools)
        .set({ clicks: sql`${tools.clicks} + 1` })
        .where(eq(tools.id, Number(id)))

    const updated = await db.select().from(tools).where(eq(tools.id, Number(id)))

    if (!updated[0]) {
        throw createError({ statusCode: 404, message: 'Tool not found' })
    }

    return updated[0]
})