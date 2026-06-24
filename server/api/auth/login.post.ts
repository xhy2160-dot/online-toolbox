// server/api/auth/login.post.ts
import { eq, or } from 'drizzle-orm'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
    const { identifier, password } = await readBody(event) // identifier = username OR email

    if (!identifier || !password) {
        throw createError({ statusCode: 400, message: 'Username/email and password required' })
    }

    const result = await db.select().from(users)
        .where(or(eq(users.username, identifier), eq(users.email, identifier)))

    const user = result[0]
    console.log(user)

    if (!user) {
        throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    const valid = await verifyPassword(user.password, password)

    if (!valid) {
        throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    await setUserSession(event, {
        user: { username: user.username, email: user.email, id: user.id },
    })

    return { username: user.username, email: user.email, id: user.id }
})