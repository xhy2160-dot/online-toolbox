// server/api/ai/stocks-summary.get.ts
import Groq from "groq-sdk";

// Initialize the Groq SDK using the developer console environment variable key
const groq = new Groq({ apiKey: useRuntimeConfig().groqApiKey || process.env.GROQ_API_KEY });

let cache: { summary: string; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour caching layer

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const stocks = query.stocks as string;

    // 1. Guard against unmounted/empty frontend lists
    if (!stocks || stocks.trim() === '') {
        return { summary: '' };
    }

    // 2. Return cached information if within the valid timeframe
    if (cache && (Date.now() - cache.timestamp < CACHE_DURATION)) {
        return { summary: cache.summary };
    }

    try {
        // 3. Make the completion call to Groq using a supported, high-speed model
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Give a brief 2-3 sentence summary of why these stocks may have moved today: ${stocks}. Be concise and conversational, no markdown formatting or bullet points.`,
                },
            ],
            // Note: Changed to a standard stable Groq model ID.
            // If you specifically want the openai/gpt-oss-20b model mix, make sure it's active in your plan!
            model: "openai/gpt-oss-20b",
        });

        // 4. Safely extract the generated content
        const summary = chatCompletion.choices[0]?.message?.content || "";

        // 5. Update the internal state cache on a successful response string
        if (summary) {
            cache = { summary, timestamp: Date.now() };
        }

        return { summary };

    } catch (err: any) {
        console.error("Groq SDK Integration Error Details:", err.message || err);

        // Fail gracefully back to stale cache data instead of showing an empty screen
        if (cache) {
            return { summary: cache.summary };
        }
        return { summary: '', debugError: err.message };
    }
});