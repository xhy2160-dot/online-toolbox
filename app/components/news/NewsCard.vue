<!-- components/news/NewsCard.vue -->
<template>
  <a :href="article.url" target="_blank" class="card">
    <img :src="article.urlToImage" :alt="article.title" />
    <div class="card-body">
      <span class="source">{{ article.source.name }}</span>
      <h3>{{ article.title }}</h3>
      <p>{{ article.description }}</p>
    </div>
  </a>
</template>

<script setup>
defineProps(['article'])
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  border: 1px solid #e8e0d8;
}

.card:hover {
  transform: translateY(-4px);
}

img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.source {
  font-size: 0.75rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

p {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>