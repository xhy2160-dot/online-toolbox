// server/api/news/index.get.ts
import { defineEventHandler, getQuery } from 'h3'

const BUILT_IN_CATEGORIES = ['general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment']

// 1. Explicitly type the handler return structure to make Nuxt 4/Nitro's compiler happy
export default defineEventHandler(async (event): Promise<any[]> => {
    const query = getQuery(event)
    const category = (query.category as string) || 'general'
    const city = (query.city as string) || ''
    const page = Number(query.page) || 1
    const pageSize = 12

    // In Nuxt 4, runtimeConfig is accessed safely globally on the server
    const config = useRuntimeConfig()
    const apiKey = config.newsApiKey

    let endpoint = 'https://newsapi.org/v2/top-headlines'
    let fetchQuery: Record<string, any> = {
        page,
        pageSize,
        apiKey
    }

    if (category === 'breaking') {
        fetchQuery.country = 'us'
        fetchQuery.sortBy = 'publishedAt'
    } else if (category === 'local') {
        endpoint = 'https://newsapi.org/v2/everything'
        fetchQuery.q = city || 'local news'
        fetchQuery.sortBy = 'publishedAt'
        fetchQuery.language = 'en'
    } else if (BUILT_IN_CATEGORIES.includes(category)) {
        fetchQuery.country = 'us'
        fetchQuery.category = category
    } else {
        fetchQuery.country = 'us'
        fetchQuery.category = 'general'
    }

    try {
        // Explicitly type the generic inside $fetch
        const data = await $fetch<{ articles?: any[] }>(endpoint, { query: fetchQuery })
        const articles = data?.articles || []

        return articles.filter((a: any) =>
            a &&
            a.title &&
            a.title !== '[Removed]' &&
            a.urlToImage
        )
    } catch (err: any) {
        console.error("NewsAPI Fetch Error:", err.message || err)
        return []
    }
})