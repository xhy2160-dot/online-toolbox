<!-- components/Card.vue -->
<template>
  <div class="card" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div class="card-head">
      <div class="icon-box">
        <span class="icon">{{ tool.icon }}</span>
      </div>
      <span class="use">USE: {{ tool.clicks }}</span>
    </div>
    <h3 class="card-title">{{ tool.name }}</h3>
    <p class="card-desc">{{ tool.description }}</p>

    <Transition name="fade">
      <a v-if="hovered" :href="tool.url ?? undefined" class="open-link">
        Open tool <span class="chevron">›</span>
      </a>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const hovered = ref(false)

import type { SerializedTool } from '~~/shared/types/tool'

defineProps<{
  tool: SerializedTool
}>()
</script>

<style scoped>
.card {
  background: #1e1e2e;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  min-height: 200px;
  min-width: 200px;
}

.card:hover {
  background: #252538;
}

.card-head{
  display: flex;
  text-align: center;
  justify-content: space-between;
}

.use{
  font-size: 0.78rem;
  color: #aaa;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #15803d;;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
  flex-shrink: 0;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4ade80;
  margin: 0;
}

.card-desc {
  font-size: 0.78rem;
  color: #aaa;
  line-height: 1.5;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.open-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #4ade80;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: auto;
}

.chevron {
  display: inline-block;
  transition: transform 0.15s;
}

.open-link:hover .chevron {
  transform: translateX(3px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>