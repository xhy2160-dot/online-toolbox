import { c as defineEventHandler, r as readBody, e as createError } from '../../../_/nitro.mjs';
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
const askGroq = async (query) => {
  var _a, _b;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: query
        }
      ],
      // Note: Changed to a standard stable Groq model ID.
      // If you specifically want the openai/gpt-oss-20b model mix, make sure it's active in your plan!
      model: "openai/gpt-oss-20b"
    });
    const response = ((_b = (_a = chatCompletion.choices[0]) == null ? void 0 : _a.message) == null ? void 0 : _b.content) || "";
    return { response };
  } catch (err) {
    throw err;
  }
};

const emailRewriter_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, tone = "Professional" } = body;
  if (!email) {
    throw createError({ statusCode: 400, message: "Missing email field" });
  }
  const data = await askGroq(
    `Rewrite this email in a ${tone} tone. Return only the rewritten email, no explanations.

${email}`
  );
  return { data };
});

export { emailRewriter_post as default };
//# sourceMappingURL=email-rewriter.post.mjs.map
