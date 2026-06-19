<!-- components/AppFooter.vue -->
<template>
  <footer class="footer">
    <p class="tagline">Online tool box · Updated daily</p>
    <p class="copy">© {{ year }}</p>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid #d8d0c7;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
}

.tagline {
  font-size: 0.8rem;
  color: #999;
}

.copy {
  font-size: 0.75rem;
  color: #bbb;
}
</style>