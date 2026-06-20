<!-- pages/index.vue -->
<template>
  <div class="page">
    <aside class="popular">
      <div class="tools-grid">
        <ToolCard v-for="tool in tools" :key="tool.name" :tool="tool" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
 const { data: tools, pending, error } = await useFetch('/api/productivity/tools')
</script>

<style scoped>
.page {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

.popular {
  display: flex;
  flex-direction: column;
  padding: 3rem 0;
  width: 100%;
}

.popular-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.popular-title {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #666;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
}

/* TABLET */
@media (max-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* MOBILE */
@media (max-width: 640px) {
  .page {
    gap: 0;
  }

  .popular {
    padding: 1.5rem 0;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
}

/* SMALL MOBILE */
@media (max-width: 380px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>