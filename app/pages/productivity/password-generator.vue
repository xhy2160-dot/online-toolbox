<!-- pages/productivity/password-generator.vue -->
<template>
  <div class="tool">
    <div class="tool-header">
      <NuxtLink to="/productivity" class="back">← Productivity</NuxtLink>
      <h1>Password Generator</h1>
      <p>Generate strong, secure passwords entirely in your browser. Nothing is sent to a server.</p>
    </div>

    <div class="panel">
      <div class="output-row">
        <span class="output">{{ password }}</span>
        <button class="icon-btn" @click="copy" :title="copied ? 'Copied!' : 'Copy'">
          {{ copied ? '✓' : '⧉' }}
        </button>
        <button class="icon-btn" @click="generate" title="Generate new">↻</button>
      </div>

      <div class="strength-bar">
        <div class="strength-fill" :style="{ width: strength.pct + '%', background: strength.color }"></div>
      </div>
      <span class="strength-label" :style="{ color: strength.color }">{{ strength.label }}</span>

      <div class="control-row">
        <label>Length</label>
        <input type="range" min="6" max="32" step="1" v-model.number="length" @input="generate" />
        <span class="length-val">{{ length }}</span>
      </div>

      <div class="options">
        <label class="checkbox">
          <input type="checkbox" v-model="useUpper" @change="generate" />
          Uppercase (A-Z)
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="useLower" @change="generate" />
          Lowercase (a-z)
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="useNumbers" @change="generate" />
          Numbers (0-9)
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="useSymbols" @change="generate" />
          Symbols (!@#$%)
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

useSeoMeta({
  title: 'Password Generator — Create Strong, Secure Passwords',
  description: 'Generate strong, secure, random passwords with custom length and character options. Free, instant, runs entirely in your browser — nothing stored.',
  ogTitle: 'Password Generator — Free Online Tool',
  ogDescription: 'Create strong, secure passwords instantly. Customize length and character types. Free and private.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebPage(),
  {
    '@type': 'SoftwareApplication',
    name: 'Password Generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0' }
  }
])

const length = ref(16)
const useUpper = ref(true)
const useLower = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)
const password = ref('')
const copied = ref(false)

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

 function  generate  () {
  let pool = ''
  if (useUpper.value) pool += UPPER
  if (useLower.value) pool += LOWER
  if (useNumbers.value) pool += NUMBERS
  if (useSymbols.value) pool += SYMBOLS

  if (!pool) {
    password.value = 'Select at least one option'
    return
  }

  const array = new Uint32Array(length.value)
  crypto.getRandomValues(array)
  let result = ''
  for (let i = 0; i < length.value; i++) {
    const index = array[i] ?? 0
    result += pool[index % pool.length] ?? ''
  }
  password.value = result
   $fetch(`/api/productivity/${'password generator'}/counter`, { method: 'POST' })
}

const strength = computed(() => {
  let pool = 0
  if (useUpper.value) pool += 26
  if (useLower.value) pool += 26
  if (useNumbers.value) pool += 10
  if (useSymbols.value) pool += 28

  const entropy = pool > 0 ? length.value * Math.log2(pool) : 0

  if (entropy < 40) return { pct: 25, label: 'Weak', color: '#dc2626' }
  if (entropy < 70) return { pct: 55, label: 'Fair', color: '#d97706' }
  if (entropy < 100) return { pct: 80, label: 'Strong', color: '#16a34a' }
  return { pct: 100, label: 'Very strong', color: '#16a34a' }
})

async function copy() {
  await navigator.clipboard.writeText(password.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

onMounted(generate)
</script>

<style scoped>
.tool {
  max-width: 540px;
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

.panel {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  padding: 1.5rem;
}

.output-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f1ea;
  border-radius: 8px;
  padding: 0.9rem 1rem;
  margin-bottom: 1.25rem;
}

.output {
  flex: 1;
  font-family: monospace;
  font-size: 1rem;
  word-break: break-all;
  color: #1a1a1a;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #666;
  padding: 4px;
}

.icon-btn:hover {
  color: #1a1a1a;
}

.strength-bar {
  height: 4px;
  background: #f0ebe3;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.strength-fill {
  height: 100%;
  transition: width 0.2s;
}

.strength-label {
  font-size: 0.8rem;
  font-weight: 600;
  display: block;
  margin-bottom: 1.25rem;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
}

.control-row label {
  font-size: 0.9rem;
  color: #666;
  width: 60px;
}

.control-row input[type="range"] {
  flex: 1;
}

.length-val {
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 24px;
  text-align: right;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 1rem;
  border-top: 1px solid #e8e0d8;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}
</style>