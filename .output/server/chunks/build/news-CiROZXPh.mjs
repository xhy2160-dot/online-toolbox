import { defineComponent, computed, ref, watch, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRoute } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main$1 = {
  __name: "NewsCard",
  __ssrInlineRender: true,
  props: ["article"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: __props.article.url,
        target: "_blank",
        class: "card"
      }, _attrs))} data-v-b67946fd><img${ssrRenderAttr("src", __props.article.urlToImage)}${ssrRenderAttr("alt", __props.article.title)} data-v-b67946fd><div class="card-body" data-v-b67946fd><span class="source" data-v-b67946fd>${ssrInterpolate(__props.article.source.name)}</span><h3 data-v-b67946fd>${ssrInterpolate(__props.article.title)}</h3><p data-v-b67946fd>${ssrInterpolate(__props.article.description)}</p></div></a>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/news/NewsCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b67946fd"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "news",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const category = computed(() => route.query.category || "general");
    const categoryLabel = computed(() => {
      const cat = category.value;
      return cat.charAt(0).toUpperCase() + cat.slice(1) + " News";
    });
    const city = ref("");
    const articles = ref([]);
    const page = ref(1);
    const pending = ref(false);
    const error = ref(false);
    const noMore = ref(false);
    ref(null);
    async function detectCity() {
      (void 0).geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const geo = await $fetch("https://nominatim.openstreetmap.org/reverse", {
          query: { lat: latitude, lon: longitude, format: "json" }
        });
        city.value = geo.address.city || geo.address.town || geo.address.village || "";
      });
    }
    async function loadMore() {
      if (pending.value || noMore.value) return;
      pending.value = true;
      error.value = false;
      try {
        const result = await $fetch("/api/news", {
          query: { category: category.value, city: city.value, page: page.value }
        });
        if (!result || result.length === 0) {
          noMore.value = true;
        } else {
          articles.value.push(...result);
          page.value++;
        }
      } catch {
        error.value = true;
      } finally {
        pending.value = false;
      }
    }
    watch(category, async () => {
      articles.value = [];
      page.value = 1;
      noMore.value = false;
      if (category.value === "local" && !city.value) await detectCity();
      await loadMore();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NewsCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-f25d1f53><div class="page-header" data-v-f25d1f53><h2 class="page-title" data-v-f25d1f53>${ssrInterpolate(unref(category) === "local" && unref(city) ? `${unref(city)} News` : unref(categoryLabel))}</h2>`);
      if (unref(category) === "local" && !unref(city)) {
        _push(`<p class="location-hint" data-v-f25d1f53> Allow location access for local news </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(pending) && unref(articles).length === 0) {
        _push(`<div class="state" data-v-f25d1f53>Loading...</div>`);
      } else if (unref(error)) {
        _push(`<div class="state" data-v-f25d1f53>Failed to load news.</div>`);
      } else {
        _push(`<div class="grid" data-v-f25d1f53><!--[-->`);
        ssrRenderList(unref(articles), (article) => {
          _push(ssrRenderComponent(_component_NewsCard, {
            key: article.url,
            article
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`<div class="trigger" data-v-f25d1f53>`);
      if (unref(pending)) {
        _push(`<span data-v-f25d1f53>Loading more...</span>`);
      } else if (unref(noMore)) {
        _push(`<span data-v-f25d1f53>No more articles</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const news = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f25d1f53"]]);

export { news as default };
//# sourceMappingURL=news-CiROZXPh.mjs.map
