<!-- pages/index.vue -->
<template>
  <div class="page">
    <!-- LEFT -->
    <section class="hero">
      <div class="status-bar">
        <span class="status-dot"></span>
        <span class="status-line"></span>
        <span class="status-text">172 TOOLS ONLINE</span>
      </div>

      <h1 class="hero-title">
        All online tools<br />
        <span class="hero-accent">in one box.</span>
      </h1>

      <p class="hero-sub">
        Free, fast, and privacy-first tools for every day work. Most tools run client-side in your
        browser. <span class="hero-pro">Nothing</span> retained, uploads are destroyed after 2 hours.
      </p>

      <div class="search-bar">
        <span class="search-caret">></span>
        <span class="search-placeholder">Search tools... (e.g. JSON, Base64, Password)</span>
        <span class="search-kbd">⌘K</span>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="stat-num">172+</span>
          <span class="stat-label">FREE TOOLS</span>
        </div>
        <div class="stat">
          <span class="stat-num">11</span>
          <span class="stat-label">AI ON-DEVICE</span>
        </div>
        <div class="stat">
          <span class="stat-num">27</span>
          <span class="stat-label">MCP INTEGRATIONS</span>
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
      <div class="tools-grid">
        <ToolCard v-for="tool in popularTools" :key="tool.name" :tool="tool" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
const popularTools = [
  { name: 'Email Rewriter', description: 'Rewrite emails in any tone using AI instantly.', icon: '✉', url: '/tools/email-rewriter' },
  { name: 'JSON Formatter', description: 'Format, beautify, and validate JSON data instantly in your browser.', icon: '{ }', url: '/tools/json-formatter' },
  { name: 'Base64 Encoder', description: 'Encode and decode Base64 strings quickly client-side.', icon: '64', url: '/tools/base64' },
  { name: 'Password Generator', description: 'Generate strong, secure passwords with custom rules.', icon: '🔑', url: '/tools/password-generator' },
  { name: 'Color Picker', description: 'Pick, convert and generate color palettes easily.', icon: '🎨', url: '/tools/color-picker' },
  { name: 'Markdown Preview', description: 'Write and preview Markdown in real time.', icon: 'MD', url: '/tools/markdown' },
]
</script>

<style scoped>
.page {
  display: flex;
  gap: 4rem;
  min-height: calc(100vh - 130px);
  align-items: flex-start;
}

/* LEFT */
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 0;
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #d8d0c7;
  border-radius: 8px;
  padding: 0.9rem 1.25rem;
  cursor: pointer;
  margin-bottom: 2.5rem;
  transition: border-color 0.15s;
}

.search-bar:hover {
  border-color: #aaa;
}

.search-caret {
  color: #16a34a;
  font-weight: 700;
  font-size: 1rem;
}

.search-placeholder {
  flex: 1;
  color: #aaa;
  font-size: 0.85rem;
}

.search-kbd {
  font-size: 0.75rem;
  color: #aaa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
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
</style>