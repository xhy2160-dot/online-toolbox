<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-links">
        <NuxtLink to="/" @click="showNews = false">HOME</NuxtLink>
        <NuxtLink to="/news" @click="showNews = !showNews">NEWS</NuxtLink>
        <NuxtLink to="/stocks" @click="showNews = false">STOCKS</NuxtLink>
      </div>
    </nav>

    <div class="subnav" v-if="showNews">
      <NuxtLink
          v-for="cat in categories"
          :key="cat"
          :to="`/news?category=${cat}`"
          :class="{ 'query-active': route.query.category === cat || (!route.query.category && cat === 'general') }"
      >
        {{ cat }}
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const showNews = ref(false)
const route = useRoute()

// Simple array to keep your subnav links clean and DRY
const categories = ['breaking','local','general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment']

// Keep subnav open on page load or direct link if path matches news
if (route.path.startsWith('/news')) {
  showNews.value = true
}

watch(() => route.path, (path) => {
  if (!path.startsWith('/news')) {
    showNews.value = false
  }
})
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
  padding: 1.5rem 2rem;
}

.nav-links {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 3rem;
  justify-content: center;
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

.subnav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 0.75rem 2rem;
  border-top: 1px solid #e8e0d8;
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

/* CHANGED: This custom class checks queries precisely instead of relying on default router behavior */
.subnav a.query-active {
  color: #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  padding-bottom: 1px;
}
</style>