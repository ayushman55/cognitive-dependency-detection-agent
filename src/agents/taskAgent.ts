import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function taskAgent() {

    const result = await generateText({

        model: google('gemini-2.5-flash-lite'),

        system: `
You are a cognitive task generation AI.

Generate ONE short task that tests:
- reasoning
- creativity
- critical thinking
- problem solving

Keep it concise.
Do not number anything.
        `,

        prompt: `
Generate one cognitive challenge question.
        `
    });

    return result.text;
}