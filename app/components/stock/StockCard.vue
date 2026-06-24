<template>
  <div
      class="card"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
  >
    <button
        v-if="isHovered"
        class="delete-btn"
        aria-label="Remove stock"
        @click="$emit('delete', stock.ticker)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <div class="card-top">
      <div class="ticker-wrap">
        <span class="ticker">{{ stock.ticker }}</span>
      </div>
      <span class="price">${{ stock.price?.toFixed(2) }}</span>
    </div>
    <div class="card-bottom">
      <span class="change" :class="stock.change >= 0 ? 'up' : 'down'">
        {{ stock.change >= 0 ? '+' : '' }}{{ stock.change?.toFixed(2) }}
        ({{ stock.changePercent?.toFixed(2) }}%)
      </span>
      <span class="range">H: ${{ stock.high?.toFixed(2) }} · L: ${{ stock.low?.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup>
// Added the missing ref import
import { ref } from 'vue'

defineProps(['stock'])
defineEmits(['delete'])

const isHovered = ref(false)
</script>

<style scoped>
.card {
  position: relative; /* Added to keep absolute layout calculations happy if needed */
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e8e0d8;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticker-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ticker {
  font-size: 1.25rem;
  font-weight: 700;
}

.delete-btn {
  /* Positioned absolutely so it doesn't break your grid layout when appearing/disappearing */
  position: absolute;
  top: 5px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.delete-btn:hover {
  background: #f3f4f6;
  color: #dc2626;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change {
  font-weight: 600;
  font-size: 0.95rem;
}

.up { color: #16a34a; }
.down { color: #dc2626; }

.range {
  font-size: 0.8rem;
  color: #999;
}
</style>