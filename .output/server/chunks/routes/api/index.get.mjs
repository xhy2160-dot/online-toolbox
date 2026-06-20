import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const builtInCategories = ["general", "business", "technology", "science", "health", "sports", "entertainment"];
const index_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const category = query.category || "general";
  const city = query.city || "";
  const page = Number(query.page) || 1;
  const pageSize = 12;
  if (category === "breaking") {
    const data = await $fetch("https://newsapi.org/v2/top-headlines", {
      query: {
        country: "us",
        sortBy: "publishedAt",
        page,
        pageSize,
        apiKey: process.env.NEWS_API_KEY
      }
    });
    return data.articles.filter((a) => a.title && a.urlToImage);
  }
  if (category === "local") {
    const searchTerm = city || "local news";
    const data = await $fetch("https://newsapi.org/v2/everything", {
      query: {
        q: searchTerm,
        sortBy: "publishedAt",
        language: "en",
        page,
        pageSize,
        apiKey: process.env.NEWS_API_KEY
      }
    });
    return data.articles.filter((a) => a.title && a.urlToImage);
  }
  if (builtInCategories.includes(category)) {
    const data = await $fetch("https://newsapi.org/v2/top-headlines", {
      query: {
        country: "us",
        category,
        page,
        pageSize,
        apiKey: process.env.NEWS_API_KEY
      }
    });
    return data.articles.filter((a) => a.title && a.urlToImage);
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
