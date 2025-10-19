import OpenAI from 'openai';



const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_KEY,
    // defaultHeaders: {
    //     "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    //     "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    // },
});


export async function LLMTextResponseService(prompt: object) {
    const completion: any = await client.chat.completions.create({
        model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages: [
            {
                "role": "user",
                "content": JSON.stringify(prompt)
            }
        ],
    });

    return completion.choices[0].message
}