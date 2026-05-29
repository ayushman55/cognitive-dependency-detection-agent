import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function reasoningAgent(userAnswer: string) {

    const result = await generateText({

        model: google('gemini-2.5-flash-lite'),

        system: `
You are a reasoning analysis agent.

Your task:
1. Analyze independent thinking
2. Analyze reasoning depth
3. Evaluate critical thinking
4. Keep response concise
        `,

        prompt: `
Analyze this answer:

${userAnswer}
        `
    });

    return result.text;
}