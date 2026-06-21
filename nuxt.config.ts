// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // 1. Move the future flag out of runtimeConfig to the root level
  future: {
    compatibilityVersion: 4, // Ensures true Nuxt 4 directory structures and features
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },

  runtimeConfig: {
    // Private keys (Server-side only)
    groqApiKey: process.env.GROQ_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    newsApiKey: process.env.NEWS_API_KEY,
    finnhubApiKey: process.env.FINNHUB_API_KEY,
    databaseUrl: process.env.DATABASE_URL,

    // Explicitly configure session for nuxt-auth-utils
    session: {
      password: process.env.NUXT_SESSION_PASSWORD
    },

    // Public keys (Exposed to the browser client)
    public: {
      // Provide a fallback empty string so Nuxt can safely re-bind it via environment variables
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA_MEASUREMENT_ID || '',
    }
  },

  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  modules: [
    'nuxt-auth-utils',
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org'
  ],

  // Configuration for @nuxtjs/sitemap & @nuxtjs/robots
  site: {
    url: 'https://xoxy.cc'
  },

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