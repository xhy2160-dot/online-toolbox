<!-- components/stock/StockCard.vue -->
<template>
  <div class="card">
    <div class="card-top">
      <span class="ticker">{{ stock.ticker }}</span>
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
defineProps(['stock'])
</script>

<style scoped>
.card {
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

.ticker {
  font-size: 1.25rem;
  font-weight: 700;
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