<!-- pages/tools/email-rewriter.vue -->
<template>
  <div class="tool">
    <div class="tool-header">
      <NuxtLink to="/productivity" class="back">← Productivity</NuxtLink>
      <h1>Email Rewriter</h1>
      <p>Paste your email and rewrite it in any tone instantly.</p>
    </div>

    <div class="tool-body">
      <div class="panel">
        <div class="panel-header">
          <label>Original Email</label>
          <button class="clear-btn" @click="input = ''">Clear</button>
        </div>
        <textarea
            v-model="input"
            placeholder="Paste your email here..."
            class="textarea"
        />
      </div>

      <div class="controls">
        <div class="tones">
          <button
              v-for="tone in tones"
              :key="tone"
              class="tone-btn"
              :class="{ active: selectedTone === tone }"
              @click="selectedTone = tone"
          >
            {{ tone }}
          </button>
        </div>
        <button class="rewrite-btn" :disabled="!input || loading" @click="rewrite">
          {{ loading ? 'Rewriting...' : 'Rewrite →' }}
        </button>
      </div>

      <div class="panel" v-if="output || loading">
        <div class="panel-header">
          <label>Rewritten Email</label>
          <button class="clear-btn" @click="copyOutput" v-if="output">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <div class="output" v-if="output">{{ output }}</div>
        <div class="output loading" v-else>Rewriting your email...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const input = ref('')
const output = ref('')
const loading = ref(false)
const copied = ref(false)
const selectedTone = ref('Professional')

const tones = [
  'Professional',
  'Friendly',
  'Formal',
  'Concise',
  'Assertive',
  'Empathetic',
]

async function rewrite() {
  if (!input.value || loading.value) return
  loading.value = true
  output.value = ''

  try {
    const response = await $fetch('/api/productivity/email-rewriter', {
      method: 'POST',
      body: {
        email: input.value,
        tone: selectedTone.value,
      }
    })
    output.value = response.data.response
    await $fetch(`/api/productivity/${3}/counter`, { method: 'POST' })
  } catch {
    output.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.tool {
  max-width: 860px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 2rem;
}

.back {
  font-size: 0.85rem;
  color: #999;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

.back:hover {
  color: #1a1a1a;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.tool-header p {
  color: #666;
  font-size: 0.95rem;
}

.tool-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e8e0d8;
}

.panel-header label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #999;
  text-transform: uppercase;
}

.clear-btn {
  font-size: 0.8rem;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.clear-btn:hover {
  color: #1a1a1a;
}

.textarea {
  width: 100%;
  min-height: 220px;
  padding: 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fff;
  border: none;
  resize: vertical;
  outline: none;
  line-height: 1.6;
}

.output {
  padding: 1rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #1a1a1a;
  white-space: pre-wrap;
  min-height: 220px;
}

.output.loading {
  color: #999;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.tones {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tone-btn {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #d8d0c7;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.tone-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.tone-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
}

.rewrite-btn {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: #1a1a1a;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;
}

.rewrite-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.rewrite-btn:not(:disabled):hover {
  opacity: 0.85;
}
</style>