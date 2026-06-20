// server/api/tools/email-rewriter.post.ts

import askGroq from "#server/utils/groq";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, tone = 'Professional' } = body

    if (!email) {
        throw createError({ statusCode: 400, message: 'Missing email field' })
    }

    const data = await askGroq(
        `Rewrite this email in a ${tone} tone. Return only the rewritten email, no explanations.\n\n${email}`
    )

    return { data }
})