import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    maxRetries: 5,
    timeout: 10000,
    baseURL: "https://api.deepseek.com",
});

export default openai;
