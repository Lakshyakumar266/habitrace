import { Router } from "express";
import { registerMiddleware } from "../middlewares/Register-middleware";
import { LLMTextResponseService } from "../services/ai.service";

const router = Router()

router.route("/").get(async (req, res) => {
    const race_name = req.query.race_name;
    const race_description = req.query.description;
    let response: any;
    const basePrompt = `
You are an assistant that writes short, engaging summaries for habit-tracking races.

Given the following race details, write a concise 1–2 sentence description that motivates users to join, while clearly reflecting what the race is about.
you could also use genz slangs or terms to make the description more fun and engaging and short and crisp.

Focus on:
- Energy and motivation (make it sound like a fun challenge)
- Clear description of the goal or habit
- Short, engaging, and fun tone
- Avoid cliches and generic phrases
- Avoid overly promotional language
- Keep it human and natural (avoid robotic tone)


### Race Details:
Name: {race_name}
Description: {race_description}

### Output format:
A single paragraph (max 400 characters) that describes the race in a way that motivates users to join. It should be text only no markup language.
`;

    response = await LLMTextResponseService({
        context: basePrompt,
        "race_name": race_name,
        "race_description": race_description
    });

    if (!response) {
        return res.status(400).send({
            message: {
                role: "system",
                content: race_description,
            }
        })
    }

    if (response.refusal != null) {
        response = await LLMTextResponseService({
            context: basePrompt,
            "race_name": race_name,
            "race_description": race_description
        });
    }

    return res.status(200).send({
        message: response
    })
})

export default router