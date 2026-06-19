// server/api/news/index.get.ts
const builtInCategories = ['general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment']

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const category = (query.category as string) || 'general'
    const city = (query.city as string) || ''
    const page = Number(query.page) || 1
    const pageSize = 12

    if (category === 'breaking') {
        const data: any = await $fetch('https://newsapi.org/v2/top-headlines', {
            query: {
                country: 'us',
                sortBy: 'publishedAt',
                page,
                pageSize,
                apiKey: useRuntimeConfig().newsApiKey ||process.env.NEWS_API_KEY,
            }
        })
        return data.articles.filter((a: any) => a.title && a.urlToImage)
    }

    if (category === 'local') {
        const searchTerm = city || 'local news'
        const data: any = await $fetch('https://newsapi.org/v2/everything', {
            query: {
                q: searchTerm,
                sortBy: 'publishedAt',
                language: 'en',
                page,
                pageSize,
                apiKey: process.env.NEWS_API_KEY,
            }
        })
        return data.articles.filter((a: any) => a.title && a.urlToImage)
    }

    if (builtInCategories.includes(category)) {
        const data: any = await $fetch('https://newsapi.org/v2/top-headlines', {
            query: {
                country: 'us',
                category,
                page,
                pageSize,
                apiKey: process.env.NEWS_API_KEY,
            }
        })
        return data.articles.filter((a: any) => a.title && a.urlToImage)
    }
})