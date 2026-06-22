<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-links" :class="{ 'mobile-open': mobileOpen }">
        <NuxtLink to="/" @click="closeAll">HOME</NuxtLink>
        <NuxtLink to="/productivity" @click="closeAll">PRODUCTIVITY</NuxtLink>
        <NuxtLink to="/finance" @click="closeAll">FINANCE</NuxtLink>
        <NuxtLink to="/news" @click="closeAll">NEWS</NuxtLink>
        <NuxtLink to="/stocks" @click="closeAll">STOCKS</NuxtLink>

        <!-- auth moves inside the slide-out menu on mobile -->
        <div class="mobile-auth">
          <button v-if="!user" class="login-link" @click="handleOpenLogin">SIGN UP / LOGIN</button>
          <template v-else>
            <span class="username">{{ user.username }}</span>
            <NuxtLink to="/account/email" @click="closeAll">Update email</NuxtLink>
            <NuxtLink to="/account/password" @click="closeAll">Change password</NuxtLink>
            <button class="logout-btn" @click="handleLogout">Logout</button>
          </template>
        </div>
      </div>

      <div class="auth-area">
        <button v-if="!user" class="login-link" @click="$emit('open-login')">SIGN UP / LOGIN</button>
        <div v-else class="user-menu" @mouseenter="showMenu = true">
          <span class="username">{{ user.username }}</span>

          <div class="dropdown" v-if="showMenu" @mouseleave="showMenu = false">
            <NuxtLink to="/account/email" @click="showMenu = false">Update email</NuxtLink>
            <NuxtLink to="/account/password" @click="showMenu = false">Change password</NuxtLink>
            <button class="logout-btn" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>

      <button class="hamburger" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }"
        aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>

    <div class="subnav" v-if="showNews && !mobileOpen">
      <NuxtLink v-for="cat in categories" :key="cat" :to="`/news?category=${cat}`"
        :class="{ 'query-active': route.query.category === cat || (!route.query.category && cat === 'general') }">
        {{ cat }}
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, navigateTo } from '#app'

const emit = defineEmits(['open-login'])

const showNews = ref(false)
const showMenu = ref(false)
const mobileOpen = ref(false)
const route = useRoute()

const { user, logout } = useAuth()

const categories = ['breaking', 'local', 'general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment']

if (route.path.startsWith('/news')) {
  showNews.value = true
}

watch(() => route.path, (newPath) => {
  showNews.value = newPath.startsWith('/news')
}, { immediate: true })

function closeAll() {
  mobileOpen.value = false
  showMenu.value = false
}

function handleOpenLogin() {
  closeAll()
  emit('open-login')
}

async function handleLogout() {
  await logout()
  closeAll()
  navigateTo('/')
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #d8d0c7;
  position: sticky;
  top: 0;
  background: #f0ebe3;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  position: relative;
}

.nav-links {
  display: flex;
  gap: 3rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #1a1a1a;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
}

.nav-links a.router-link-active {
  border-bottom: 2px solid #1a1a1a;
  padding-bottom: 2px;
}

.auth-area {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
}

.login-link {
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  color: #1a1a1a;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.user-menu {
  position: relative;
}

.username {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #1a1a1a;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 180px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.dropdown a,
.logout-btn {
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  text-decoration: none;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.dropdown a:hover,
.logout-btn:hover {
  background: #f0ebe3;
}

.logout-btn {
  color: #dc2626;
}

.subnav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 0.75rem 2rem;
  border-top: 1px solid #e8e0d8;
  background: #fbfaf8;
}

.subnav a {
  text-decoration: none;
  color: #666;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.15s;
}

.subnav a:hover {
  color: #1a1a1a;
}

.subnav a.query-active {
  color: #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  padding-bottom: 1px;
}

/* HAMBURGER — hidden on desktop */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: #1a1a1a;
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.mobile-auth {
  display: none;
}

/* MOBILE BREAKPOINT */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .auth-area {
    display: none;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 75%;
    max-width: 320px;
    background: #f0ebe3;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    padding: 5rem 2rem 2rem;
    transition: right 0.25s ease;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
    overflow-y: auto;
  }

  .nav-links.mobile-open {
    right: 0;
  }

  .nav-links a {
    width: 100%;
    padding: 1rem 0;
    border-bottom: 1px solid #e8e0d8;
  }

  .nav-links a.router-link-active {
    border-bottom: 1px solid #1a1a1a;
  }

  .mobile-auth {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #d8d0c7;
  }

  .mobile-auth a,
  .mobile-auth .username,
  .mobile-auth .login-link,
  .mobile-auth .logout-btn {
    width: 100%;
    padding: 0.75rem 0;
    text-align: left;
    font-size: 0.85rem;
  }

  .mobile-auth .logout-btn {
    color: #dc2626;
    font-weight: 600;
  }

  .subnav {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>