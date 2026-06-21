// plugins/google-analytics.client.ts
declare global {
    interface Window {
        dataLayer: any[]
        gtag: (...args: any[]) => void
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const gaId = config.public.gaMeasurementId as string

    if (!gaId) return

    // inject the Google Tag Manager script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    // initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || []

    function gtag(...args: any[]) {
        window.dataLayer.push(args)
    }

    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', gaId, {
        // disable automatic page view to avoid double-counting with router.afterEach below
        send_page_view: false
    })

    // track client-side route changes
    const router = useRouter()

    router.afterEach((to) => {
        gtag('event', 'page_view', {
            page_path: to.fullPath,
            page_title: to.meta.title || document.title
        })
    })
})