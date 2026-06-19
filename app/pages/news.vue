<!-- pages/news.vue -->
<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">
        {{ category === 'local' && city ? `${city} News` : categoryLabel }}
      </h2>
      <p v-if="category === 'local' && !city" class="location-hint">
        Allow location access for local news
      </p>
    </div>

    <div v-if="pending && articles.length === 0" class="state">Loading...</div>
    <div v-else-if="error" class="state">Failed to load news.</div>

    <div v-else class="grid">
      <NewsCard v-for="article in articles" :key="article.url" :article="article" />
    </div>

    <!-- trigger element — when visible, loads more -->
    <div ref="trigger" class="trigger">
      <span v-if="pending">Loading more...</span>
      <span v-else-if="noMore">No more articles</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const category = computed(() => route.query.category as string || 'general')
const categoryLabel = computed(() => {
  const cat = category.value
  return cat.charAt(0).toUpperCase() + cat.slice(1) + ' News'
})

const city = ref('')
const articles = ref<any[]>([])
const page = ref(1)
const pending = ref(false)
const error = ref(false)
const noMore = ref(false)
const trigger = ref<HTMLElement | null>(null)

async function detectCity() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords
    const geo: any = await $fetch('https://nominatim.openstreetmap.org/reverse', {
      query: { lat: latitude, lon: longitude, format: 'json' }
    })
    city.value = geo.address.city || geo.address.town || geo.address.village || ''
  })
}

async function loadMore() {
  if (pending.value || noMore.value) return
  pending.value = true
  error.value = false

  try {
    const result = await $fetch<any[]>('/api/news', {
      query: { category: category.value, city: city.value, page: page.value }
    })

    if (!result || result.length === 0) {
      noMore.value = true
    } else {
      articles.value.push(...result)
      page.value++
    }
  } catch {
    error.value = true
  } finally {
    pending.value = false
  }
}

// reset and reload when category changes
watch(category, async () => {
  articles.value = []
  page.value = 1
  noMore.value = false
  if (category.value === 'local' && !city.value) await detectCity()
  await loadMore()
})

// intersection observer — fires loadMore when trigger div is visible
onMounted(async () => {
  if (category.value === 'local') await detectCity()
  await loadMore()

  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) loadMore()
  }, { threshold: 0.1 })

  if (trigger.value) observer.observe(trigger.value)

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
}

.location-hint {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.25rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.trigger {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.85rem;
}

.state {
  color: #666;
  padding: 2rem 0;
}
</style>