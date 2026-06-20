<template>
  <!-- <div class="site" :class="{ 'no-scroll-view': route.path === '/' }"> -->
  <div class="site">
    <AppNav @open-login="showLogin = true" />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
    <LoginModal v-model="showLogin" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const showLogin = ref(false)
</script>

<style>
/* Reset basic spacing to prevent phantom scrollbars */
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f0ebe3;
  /* Set background on body so scrolling feels uniform */
}

.site {
  /* Use min-height instead of strict height so it can grow if content pushes it */
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.main-content {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;

  /* Flex-grow: 1 tells the main section to expand and fill all remaining space, */
  /* which automatically pushes the footer to the absolute bottom of the viewport. */
  flex: 1;
}

/* Force strict window restrictions ONLY on specific routes (like Home) if desired */
.site.no-scroll-view {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}
</style>