import { defineComponent, mergeProps, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ToolCard",
  __ssrInlineRender: true,
  props: {
    tool: {}
  },
  setup(__props) {
    const hovered = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card" }, _attrs))} data-v-31df80d7><div class="icon-box" data-v-31df80d7><span class="icon" data-v-31df80d7>${ssrInterpolate(__props.tool.icon)}</span></div><h3 class="card-title" data-v-31df80d7>${ssrInterpolate(__props.tool.name)}</h3><p class="card-desc" data-v-31df80d7>${ssrInterpolate(__props.tool.description)}</p>`);
      if (unref(hovered)) {
        _push(`<a${ssrRenderAttr("href", __props.tool.url)} class="open-link" data-v-31df80d7> Open tool <span class="chevron" data-v-31df80d7>›</span></a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToolCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-31df80d7"]]), { __name: "ToolCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const popularTools = [
      { name: "Email Rewriter", description: "Rewrite emails in any tone using AI instantly.", icon: "✉", url: "/tools/email-rewriter" },
      { name: "JSON Formatter", description: "Format, beautify, and validate JSON data instantly in your browser.", icon: "{ }", url: "/tools/json-formatter" },
      { name: "Base64 Encoder", description: "Encode and decode Base64 strings quickly client-side.", icon: "64", url: "/tools/base64" },
      { name: "Password Generator", description: "Generate strong, secure passwords with custom rules.", icon: "🔑", url: "/tools/password-generator" },
      { name: "Color Picker", description: "Pick, convert and generate color palettes easily.", icon: "🎨", url: "/tools/color-picker" },
      { name: "Markdown Preview", description: "Write and preview Markdown in real time.", icon: "MD", url: "/tools/markdown" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ToolCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-ad3e6959><section class="hero" data-v-ad3e6959><div class="status-bar" data-v-ad3e6959><span class="status-dot" data-v-ad3e6959></span><span class="status-line" data-v-ad3e6959></span><span class="status-text" data-v-ad3e6959>172 TOOLS ONLINE</span></div><h1 class="hero-title" data-v-ad3e6959> All online tools<br data-v-ad3e6959><span class="hero-accent" data-v-ad3e6959>in one box.</span></h1><p class="hero-sub" data-v-ad3e6959> Free, fast, and privacy-first tools for every day work. Most tools run client-side in your browser. <span class="hero-pro" data-v-ad3e6959>Nothing</span> retained, uploads are destroyed after 2 hours. </p><div class="search-bar" data-v-ad3e6959><span class="search-caret" data-v-ad3e6959>&gt;</span><span class="search-placeholder" data-v-ad3e6959>Search tools... (e.g. JSON, Base64, Password)</span><span class="search-kbd" data-v-ad3e6959>⌘K</span></div><div class="stats" data-v-ad3e6959><div class="stat" data-v-ad3e6959><span class="stat-num" data-v-ad3e6959>172+</span><span class="stat-label" data-v-ad3e6959>FREE TOOLS</span></div><div class="stat" data-v-ad3e6959><span class="stat-num" data-v-ad3e6959>11</span><span class="stat-label" data-v-ad3e6959>AI ON-DEVICE</span></div><div class="stat" data-v-ad3e6959><span class="stat-num" data-v-ad3e6959>27</span><span class="stat-label" data-v-ad3e6959>MCP INTEGRATIONS</span></div><div class="stat" data-v-ad3e6959><span class="stat-num" data-v-ad3e6959>$0</span><span class="stat-label" data-v-ad3e6959>TO USE</span></div></div><div class="tags" data-v-ad3e6959><span class="tag" data-v-ad3e6959>Client-side processing</span><span class="tag" data-v-ad3e6959>BYOK for AI</span><span class="tag" data-v-ad3e6959>Works offline</span><span class="tag" data-v-ad3e6959>MCP-ready</span><span class="tag" data-v-ad3e6959>Open API</span></div></section><aside class="popular" data-v-ad3e6959><div class="popular-header" data-v-ad3e6959><span class="popular-title" data-v-ad3e6959>POPULAR TOOLS</span></div><div class="tools-grid" data-v-ad3e6959><!--[-->`);
      ssrRenderList(popularTools, (tool) => {
        _push(ssrRenderComponent(_component_ToolCard, {
          key: tool.name,
          tool
        }, null, _parent));
      });
      _push(`<!--]--></div></aside></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ad3e6959"]]);

export { index as default };
//# sourceMappingURL=index-_L4Lt31W.mjs.map
