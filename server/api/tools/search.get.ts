// server/api/tools/search.get.ts
import { like, or } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tools } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
    const { q } = getQuery(event)

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
        return []
    }

    const search = `%${q.trim()}%`

    return db
        .select()
        .from(tools)
        .where(
            or(
                like(tools.name, search),
                like(tools.description, search)
            )
        )
        .limit(8)
})