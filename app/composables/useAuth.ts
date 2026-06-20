// composables/useAuth.ts

// 1. Explicitly augment the #auth-utils module so useUserSession() automatically picks up the types!
declare module '#auth-utils' {
    interface User {
        username: string
        email: string
    }
}

export const useAuth = () => {
    // Destructure from nuxt-auth-utils
    const { user, fetch: refreshSession, clear } = useUserSession()

    async function login(identifier: string, password: string) {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: { identifier, password }
        })
        await refreshSession()
    }

    async function signup(username: string, email: string, password: string) {
        await $fetch('/api/auth/signup', {
            method: 'POST',
            body: { username, email, password }
        })
        await refreshSession()
    }

    async function logout() {
        // Tip: nuxt-auth-utils handles clearing sessions automatically on its own endpoints,
        // but explicit calling here ensures local reactive state wipes instantly.
        await $fetch('/api/auth/logout', { method: 'POST' })
        await clear()
    }

    // Now 'user' will carry the type { username: string, email: string } everywhere it's imported!
    return { user, login, signup, logout }
}