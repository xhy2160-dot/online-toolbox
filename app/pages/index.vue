<!-- pages/index.vue -->
<template>
  <div class="page">
    <!-- LEFT -->
    <section class="hero">
      <div class="status-bar">
        <span class="status-dot"></span>
        <span class="status-line"></span>
        <span class="status-text">{{cat?.totalTools}}+ TOOLS ONLINE</span>
      </div>

      <h1 class="hero-title">
        All online tools<br />
        <span class="hero-accent">in one box.</span>
      </h1>

      <p class="hero-sub">
        Free, fast, and privacy-first tools for every day work. Most tools run client-side in your
        browser. <span class="hero-pro">Nothing</span> retained, uploads are destroyed after 2 hours.
      </p>

    <ToolsSearch/>

      <div class="stats">
        <div class="stat">
          <span class="stat-num">{{cat?.totalTools}}+</span>
          <span class="stat-label">FREE TOOLS</span>
        </div>
        <div class="stat">
          <span class="stat-num">{{cat?.categoryCounts[0]?.count}}</span>
          <span class="stat-label">PRODUCTIVITY</span>
        </div>
        <div class="stat">
          <span class="stat-num">{{cat?.categoryCounts[1]?.count}}</span>
          <span class="stat-label">FINANCE TOOLS</span>
        </div>
        <div class="stat">
          <span class="stat-num">$0</span>
          <span class="stat-label">TO USE</span>
        </div>
      </div>

      <div class="tags">
        <span class="tag">Client-side processing</span>
        <span class="tag">BYOK for AI</span>
        <span class="tag">Works offline</span>
        <span class="tag">MCP-ready</span>
        <span class="tag">Open API</span>
      </div>
    </section>

    <!-- RIGHT -->
    <aside class="popular">
      <div class="popular-header">
        <span class="popular-title">POPULAR TOOLS</span>
      </div>

      <div v-if="pendingTools" class="state">Loading tools...</div>
      <div v-else-if="errorTools" class="state">Failed to load tools.</div>
      <div v-else class="tools-grid">
        <ToolsCard v-for="tool in tools" :key="tool.id" :tool="tool" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Online Toolbox — Free tools for everyday work',
  description: 'Free, fast, privacy-first tools for developers and everyday work. JSON formatter, password generator, QR codes, and more — all client-side.',
  ogTitle: 'Online Toolbox — Free tools for everyday work',
  ogDescription: 'Free, fast, privacy-first tools. Most run client-side in your browser. Nothing retained.',
  ogImage: 'https://xoxy.cc/og-image.png',
  twitterCard: 'summary_large_image',
})
const {
  data: tools,
  pending: pendingTools,
  error: errorTools
} = useFetch('/api/productivity/tools')

const {
  data: cat,
  pending: pendingCat,
  error: errorCat
} = useFetch('/api/cat/count-tools-by-cat')


</script>

<style scoped>
.page {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

/* LEFT */
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 0;
  flex: 1;
  min-width: 0;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
}

.status-line {
  width: 40px;
  height: 1.5px;
  background: #4ade80;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #666;
}

.hero-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.hero-accent {
  color: #16a34a;
}

.hero-sub {
  font-size: 1rem;
  color: #666;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero-pro {
  color: #16a34a;
  font-weight: 600;
}
.stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-num {
  font-size: 1.4rem;
  font-weight: 700;
  color: #16a34a;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #999;
}

.tags {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8rem;
  color: #555;
  border: 1px solid #d8d0c7;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
}

/* RIGHT */
.popular {
  display: flex;
  flex-direction: column;
  padding: 3rem 0;
  flex: 1;
  min-width: 0;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.state {
  color: #666;
  font-size: 0.85rem;
  padding: 1rem 0;
}

/* TABLET */
@media (max-width: 900px) {
  .page {
    flex-direction: column;
    gap: 2.5rem;
  }

  .hero {
    padding: 2rem 0 0;
  }

  .popular {
    padding: 0 0 2rem;
    width: 100%;
  }

  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* MOBILE */
@media (max-width: 600px) {
  .hero-title {
    font-size: clamp(1.75rem, 9vw, 2.5rem);
  }

  .hero-sub {
    font-size: 0.9rem;
  }

  .search-bar {
    padding: 0.75rem 1rem;
  }

  .search-placeholder {
    font-size: 0.8rem;
  }

  .stats {
    gap: 1.25rem;
  }

  .stat-num {
    font-size: 1.2rem;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* SMALL MOBILE */
@media (max-width: 380px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>