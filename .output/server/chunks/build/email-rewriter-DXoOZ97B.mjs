import { _ as __nuxt_component_0 } from './nuxt-link-B7HyLkNY.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "email-rewriter",
  __ssrInlineRender: true,
  setup(__props) {
    const input = ref("");
    const output = ref("");
    const loading = ref(false);
    const copied = ref(false);
    const selectedTone = ref("Professional");
    const tones = [
      "Professional",
      "Friendly",
      "Formal",
      "Concise",
      "Assertive",
      "Empathetic"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tool" }, _attrs))} data-v-c1f0698f><div class="tool-header" data-v-c1f0698f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tools",
        class: "back"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Tools`);
          } else {
            return [
              createTextVNode("← Tools")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 data-v-c1f0698f>Email Rewriter</h1><p data-v-c1f0698f>Paste your email and rewrite it in any tone instantly.</p></div><div class="tool-body" data-v-c1f0698f><div class="panel" data-v-c1f0698f><div class="panel-header" data-v-c1f0698f><label data-v-c1f0698f>Original Email</label><button class="clear-btn" data-v-c1f0698f>Clear</button></div><textarea placeholder="Paste your email here..." class="textarea" data-v-c1f0698f>${ssrInterpolate(unref(input))}</textarea></div><div class="controls" data-v-c1f0698f><div class="tones" data-v-c1f0698f><!--[-->`);
      ssrRenderList(tones, (tone) => {
        _push(`<button class="${ssrRenderClass([{ active: unref(selectedTone) === tone }, "tone-btn"])}" data-v-c1f0698f>${ssrInterpolate(tone)}</button>`);
      });
      _push(`<!--]--></div><button class="rewrite-btn"${ssrIncludeBooleanAttr(!unref(input) || unref(loading)) ? " disabled" : ""} data-v-c1f0698f>${ssrInterpolate(unref(loading) ? "Rewriting..." : "Rewrite →")}</button></div>`);
      if (unref(output) || unref(loading)) {
        _push(`<div class="panel" data-v-c1f0698f><div class="panel-header" data-v-c1f0698f><label data-v-c1f0698f>Rewritten Email</label>`);
        if (unref(output)) {
          _push(`<button class="clear-btn" data-v-c1f0698f>${ssrInterpolate(unref(copied) ? "Copied!" : "Copy")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(output)) {
          _push(`<div class="output" data-v-c1f0698f>${ssrInterpolate(unref(output))}</div>`);
        } else {
          _push(`<div class="output loading" data-v-c1f0698f>Rewriting your email...</div>`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/email-rewriter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const emailRewriter = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c1f0698f"]]);

export { emailRewriter as default };
//# sourceMappingURL=email-rewriter-DXoOZ97B.mjs.map
