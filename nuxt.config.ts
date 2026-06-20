// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    // private — server-only, never exposed to client
    groqApiKey: process.env.GROQ_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    newsApiKey: process.env.NEWS_API_KEY,
    finnhubApiKey: process.env.FINNHUB_API_KEY,
    databaseUrl: process.env.DATABASE_URL,
  },
  devtools: { enabled: true },
  css:["~/assets/css/main.css"],
  modules: ['nuxt-auth-utils','@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Inter: [400, 600, 700],
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  }
})
