// plugins/analytics.client.ts
import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app'

// Augment the window object so TypeScript knows about dataLayer and gtag
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const gaId = config.public.gaMeasurementId as string

    // Skip setup if the ID is missing (e.g., in local development)
    if (!gaId) {
        console.warn('Google Analytics ID missing. Tracking disabled.')
        return
    }

    // 1. Inject the official Google Analytics script tag
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    // 2. Initialize the global tracking layer
    window.dataLayer = window.dataLayer || []

    function gtag(...args: any[]) {
        // Google Analytics explicitly requires JavaScript's native 'arguments' object
        window.dataLayer.push(arguments)
    }

    window.gtag = gtag

    // 3. Configure GA4
    gtag('js', new Date())
    gtag('config', gaId, {
        // Disable automatic tracking so it doesn't double-count the first landing page
        send_page_view: false
    })

    // 4. Hook into the Nuxt router to track Single Page Application (SPA) route changes
    const router = useRouter()

    router.afterEach((to) => {
        gtag('event', 'page_view', {
            page_path: to.fullPath,
            page_title: to.meta.title || document.title
        })
    })
})