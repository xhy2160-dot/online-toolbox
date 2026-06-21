<!-- pages/productivity/qr-code.vue -->
<template>
  <div class="tool">
    <div class="tool-header">
      <NuxtLink to="/productivity" class="back">← Tools</NuxtLink>
      <h1>QR Code Generator</h1>
      <p>Generate QR codes for URLs, text, or any data — instantly in your browser, nothing stored.</p>
    </div>

    <div class="panel">
      <div class="field">
        <label>Text or URL</label>
        <input v-model="text" type="text" placeholder="https://example.com" @keyup.enter="generate" />
      </div>

      <div class="controls-row">
        <div class="control">
          <label>Size</label>
          <input type="range" min="150" max="400" step="10" v-model.number="size" />
          <span class="control-val">{{ size }}px</span>
        </div>
        <div class="control color-control">
          <label>Color</label>
          <input type="color" v-model="color" />
        </div>
      </div>

      <button class="generate-btn" @click="generate" :disabled="!text">
        Generate QR Code
      </button>

      <div class="qr-preview" v-if="generated">
        <div ref="qrContainer"></div>
      </div>

      <button class="download-btn" v-if="generated" @click="download">
        Download PNG
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

const text = ref('https://example.com')
const size = ref(240)
const color = ref('#1a1a1a')
const qrContainer = ref<HTMLElement | null>(null)
const generated = ref(false)

async function generate() {
  if (!text.value) return
  generated.value = true

  await nextTick()
  if (!qrContainer.value) return

  qrContainer.value.innerHTML = ''

  const canvas = document.createElement('canvas')
  await QRCode.toCanvas(canvas, text.value, {
    width: size.value,
    margin: 1,
    color: {
      dark: color.value,
      light: '#ffffff',
    },
  })

  qrContainer.value.appendChild(canvas)
  $fetch(`/api/productivity/${'QR Code Generator'}/counter`, { method: 'POST' })
}

function download() {
  const canvas = qrContainer.value?.querySelector('canvas')
  if (!canvas) return

  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
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

.field {
  margin-bottom: 1.25rem;
}

.field label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.45rem;
}

.field input[type="text"] {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid #d8d0c7;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
}

.field input[type="text"]:focus {
  border-color: #1a1a1a;
}

.controls-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.control {
  flex: 1;
}

.control label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.control input[type="range"] {
  width: 100%;
}

.control-val {
  font-size: 0.8rem;
  color: #666;
}

.color-control input[type="color"] {
  width: 100%;
  height: 38px;
  padding: 2px;
  border: 1px solid #d8d0c7;
  border-radius: 8px;
  cursor: pointer;
}

.generate-btn {
  width: 100%;
  padding: 0.85rem;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.generate-btn:not(:disabled):hover {
  opacity: 0.88;
}

.qr-preview {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  background: #f5f1ea;
  border-radius: 10px;
  margin-top: 1.25rem;
}

.download-btn {
  width: 100%;
  padding: 0.85rem;
  background: #fff;
  color: #1a1a1a;
  border: 1px solid #d8d0c7;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.75rem;
  transition: background 0.15s;
}

.download-btn:hover {
  background: #f5f1ea;
}
</style>