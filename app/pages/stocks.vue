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

    <div class="add-ticker-section">
      <form @submit.prevent="handleAddTickerSubmit" class="ticker-form">
        <input
            v-model="newTicker"
            type="text"
            placeholder="Add ticker to watchlist (e.g. AAPL)"
            maxlength="5"
            class="ticker-input"
        />
        <button type="submit" class="add-btn" @click="handleAddTickerSubmit">Watch Ticker</button>
      </form>
    </div>

    <div v-if="pending && !data" class="state">Loading...</div>
    <div v-else-if="error" class="state">Failed to load stocks.</div>
    <div v-else class="grid">
      <StockCard
          v-for="stock in data"
          :key="stock.ticker"
          :stock="stock"
          @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
const { user } = useUserSession()

const lastUpdated = ref(new Date())
let timerId: NodeJS.Timeout | null = null
const newTicker = ref('')

const { data, pending, error, refresh } = useFetch<any[]>('/api/stocks', {
  onResponse() {
    lastUpdated.value = new Date()
  }
})

onMounted(() => {
  timerId = setInterval(() => {
    refresh()
  }, 60000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

const tickers = computed(() =>
    data.value?.map((s: any) => s.ticker).join(',') || ''
)

const { data: aiData, pending: summaryPending } = useFetch<any>('/api/ai/stocks-summary', {
  query: computed(() => ({ stocks: tickers.value })),
  watch: [tickers],
  immediate: true
})

const summary = computed(() => aiData.value?.summary || '')

/* --- EVENT HANDLERS --- */

// Local submission runner for the primary page form input
const handleAddTickerSubmit= async () =>{
  const cleanTicker = newTicker.value.trim().toUpperCase()
  if (!cleanTicker) return

  // Prevent client duplicate triggers
  const exists = data.value?.some((s: any) => s.ticker === cleanTicker)
  if (exists) {
    newTicker.value = ''
    return
  }
if(!user.value?.id){
  return alert('Please sign in to save watchlist.')
}

const id = user.value?.id

  try {
    const res = await $fetch('/api/stocks/add', {
      method: 'POST',
      body: { ticker: cleanTicker, uid:id}
    })

    console.log(res)
    newTicker.value = '' // Flush form input state clear
    refresh()
  } catch (err) {
    console.error('Failed to add ticker:', err)
  }
}

const  handleDelete= async (ticker: string) =>{

  if(!user.value?.id){
    return alert('Please sign in to save watchlist.')
  }

  const id = user.value?.id

  try {

    await $fetch('/api/stocks/delete', {
      method: 'POST',
      body: { ticker,uid:id }
    })

    refresh()
  } catch (err) {
    console.error('Failed to delete ticker:', err)
    refresh()
  }
}
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
  margin-bottom: 1.5rem;
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

/* Page Ticker Form Layout styling */
.add-ticker-section {
  margin-bottom: 2rem;
  max-width: 450px;
}

.ticker-form {
  display: flex;
  gap: 0.5rem;
}

.ticker-input {
  flex: 1;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  font-size: 0.9rem;
  text-transform: uppercase;
  outline: none;
  background: #fff;
  transition: border-color 0.15s ease;
}

.ticker-input:focus {
  border-color: #4f8ef7;
}

.add-btn {
  background:#ffffff ;
  color: #111111;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.add-btn:hover {
  background: #ccc;
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