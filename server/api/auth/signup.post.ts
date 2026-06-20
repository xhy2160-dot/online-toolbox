// server/api/auth/signup.post.ts
import { eq, or } from 'drizzle-orm'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const username = body.username?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!username || !email || !password) {
        throw createError({ statusCode: 400, message: 'Username, email, and password are required' })
    }

    if (password.length < 8) {
        throw createError({ statusCode: 400, message: 'Password must be at least 8 characters long' })
    }

    // 1. Check for duplicates
    const existing = await db.select()
        .from(users)
        .where(or(eq(users.username, username), eq(users.email, email)))
        .limit(1)

    if (existing.length > 0) {
        throw createError({ statusCode: 409, message: 'Username or email is already taken' })
    }

    try {
        const hashedPassword = await hashPassword(password)

        // 2. Execute standard MySQL Insert (No .returning() block)
        await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
        })

        // 3. Since we already have the sanitized 'username' and 'email' in memory 
        // from the input validation step, we can use them safely without 
        // a secondary SELECT query!
        const sessionUser = {
            username: username,
            email: email
        }

        // 4. Save to cookie session
        await setUserSession(event, {
            user: sessionUser
        })

        return sessionUser

    } catch (err: any) {
        console.error("Critical Signup Process Failure:", err.message || err)
        throw createError({
            statusCode: err.statusCode || 500,
            message: err.message || 'Internal registration exception occurred.'
        })
    }
})