import { c as defineEventHandler, g as getQuery } from '../../../_/nitro.mjs';
import Groq from 'groq-sdk';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
let cache = null;
const CACHE_DURATION = 60 * 60 * 1e3;
const stocksSummary_get = defineEventHandler(async (event) => {
  var _a, _b;
  const query = getQuery(event);
  const stocks = query.stocks;
  if (!stocks || stocks.trim() === "") {
    return { summary: "" };
  }
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return { summary: cache.summary };
  }
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Give a brief 2-3 sentence summary of why these stocks may have moved today: ${stocks}. Be concise and conversational, no markdown formatting or bullet points.`
        }
      ],
      // Note: Changed to a standard stable Groq model ID.
      // If you specifically want the openai/gpt-oss-20b model mix, make sure it's active in your plan!
      model: "openai/gpt-oss-20b"
    });
    const summary = ((_b = (_a = chatCompletion.choices[0]) == null ? void 0 : _a.message) == null ? void 0 : _b.content) || "";
    if (summary) {
      cache = { summary, timestamp: Date.now() };
    }
    return { summary };
  } catch (err) {
    console.error("Groq SDK Integration Error Details:", err.message || err);
    if (cache) {
      return { summary: cache.summary };
    }
    return { summary: "", debugError: err.message };
  }
});

export { stocksSummary_get as default };
//# sourceMappingURL=stocks-summary.get.mjs.map
