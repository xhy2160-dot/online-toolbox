<template>
  <div class="search-wrap">
    <div class="search-bar" :class="{ focused }">
      <span class="search-caret">></span>
      <input
          ref="inputRef"
          v-model="query"
          type="text"
          placeholder="Search tools... (e.g. JSON, Base64, Password)"
          @focus="focused = true"
          @blur="handleBlur"
          @keydown.escape="close"
          @keydown.enter="goToFirst"
      />
      <span class="search-kbd" v-if="!focused">⌘K</span>
      <button v-else class="clear-btn" @click="close">✕</button>
    </div>

    <!-- results dropdown -->
    <div class="results" v-if="focused && query.length > 0">
      <div v-if="pending" class="state">Searching...</div>
      <div v-else-if="!results.length" class="state">No tools found for "{{ query }}"</div>
      <NuxtLink
          v-else
          v-for="tool in results"
          :key="tool.id"
          :to="tool.url"
          class="result-item"
          @mousedown.prevent
          @click="close"
      >
        <div class="result-icon">{{ tool.icon }}</div>
        <div class="result-info">
          <span class="result-name">{{ tool.name }}</span>
          <span class="result-desc">{{ tool.description }}</span>
        </div>
        <span class="result-arrow">→</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SerializedTool } from '~~/shared/types/tool'

const query = ref('')
const focused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const results = ref<SerializedTool[]>([])
const pending = ref(false)

// debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (val) => {
  if (!val.trim()) {
    results.value = []
    return
  }

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchTools(val.trim()), 300)
})

async function fetchTools(search: string) {
  pending.value = true
  try {
    results.value = await $fetch<SerializedTool[]>('/api/tools/search', {
      query: { q: search }
    })
  } catch {
    results.value = []
  } finally {
    pending.value = false
  }
}

function handleBlur() {
  // small delay so NuxtLink click registers before we close
  setTimeout(() => {
    focused.value = false
    query.value = ''
    results.value = []
  }, 150)
}

function close() {
  focused.value = false
  query.value = ''
  results.value = []
  inputRef.value?.blur()
}

function goToFirst() {
  if (results.value[0]?.url) {
    navigateTo(results.value[0].url)
    close()
  }
}

// CMD+K / CTRL+K shortcut
onMounted(() => {
  window.addEventListener('keydown', handleShortcut)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleShortcut)
})

function handleShortcut(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    inputRef.value?.focus()
    focused.value = true
  }
}
</script>

<style scoped>
.search-wrap {
  position: relative;
  width: 90%;
  margin-bottom: 2.5rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #d8d0c7;
  border-radius: 8px;
  padding: 0.9rem 1.25rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  cursor: text;
}

.search-bar.focused {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.search-caret {
  color: #16a34a;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  font-family: inherit;
  color: #1a1a1a;
  background: transparent;
  min-width: 0;
}

input::placeholder {
  color: #aaa;
}

.search-kbd {
  font-size: 0.75rem;
  color: #aaa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  flex-shrink: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  flex-shrink: 0;
  line-height: 1;
}

.clear-btn:hover {
  color: #1a1a1a;
}

/* results dropdown */
.results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 200;
}

.state {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #999;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #f0ebe3;
  transition: background 0.1s;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: #faf8f5;
}

.result-icon {
  width: 36px;
  height: 36px;
  background: #1e1e2e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.result-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
}

.result-desc {
  font-size: 0.78rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-arrow {
  color: #ccc;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.result-item:hover .result-arrow {
  color: #16a34a;
}
</style>