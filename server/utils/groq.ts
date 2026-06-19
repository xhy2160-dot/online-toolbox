// server/api/ai/stocks-summary.get.ts
import Groq from "groq-sdk";

const config = useRuntimeConfig()
// Initialize the Groq SDK using the developer console environment variable key
const groq = new Groq({ apiKey: config.groqApiKey || process.env.GROQ_API_KEY });


const askGroq = async (query:string) =>{
    try {
        // 3. Make the completion call to Groq using a supported, high-speed model
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: query,
                },
            ],
            // Note: Changed to a standard stable Groq model ID.
            // If you specifically want the openai/gpt-oss-20b model mix, make sure it's active in your plan!
            model: "openai/gpt-oss-20b",
        });

        // 4. Safely extract the generated content
        const response = chatCompletion.choices[0]?.message?.content || "";

        return { response };

    } catch (err: any) {
        throw err;
    }

}

export default askGroq;





