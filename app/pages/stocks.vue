<template>
  <div>
    <div class="page-header">
      <span class="updated">Updated at {{ lastUpdated.toLocaleTimeString() }}</span>
    </div>

    <div class="ai-summary" v-if="summary">
      <span class="ai-label">AI Summary</span>
      <p>{{ summary }}</p>
    </div>
    <div class="ai-summary loading" v-else-if="summaryPending">
      Analyzing market movement...
    </div>

    <div v-if="pending && !data" class="state">Loading...</div>
    <div v-else-if="error" class="state">Failed to load stocks.</div>
    <div v-else class="grid">
      <StockCard v-for="stock in data" :key="stock.ticker" :stock="stock" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const lastUpdated = ref(new Date())
let timerId: NodeJS.Timeout | null = null

// 1. Remove top-level 'await' by using standard lazy configurations or raw useFetch initialization
const { data, pending, error, refresh } = useFetch<any[]>('/api/stocks', {
  onResponse() {
    lastUpdated.value = new Date()
  }
})

// 2. Set up a clean, native client-side interval poll loop
onMounted(() => {
  timerId = setInterval(() => {
    refresh()
  }, 60000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

// Build ticker string safely
const tickers = computed(() =>
    data.value?.map((s: any) => s.ticker).join(',') || ''
)

// 3. Keep AI summary tracking dynamic without using a top-level blocking await
const { data: aiData, pending: summaryPending } = useFetch<any>('/api/ai/stocks-summary', {
  query: computed(() => ({ stocks: tickers.value })),
  watch: [tickers],
  // CRITICAL: immediate true combined with server-side check prevents redundant calls
  immediate: true
})

const summary = computed(() => aiData.value?.summary || '')
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.updated {
  font-size: 0.8rem;
  color: #999;
}

.ai-summary {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ai-summary.loading {
  color: #999;
  font-size: 0.9rem;
}

.ai-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
}

.ai-summary p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.state {
  color: #666;
  padding: 2rem 0;
}
</style>