import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function dependencyAgent(
    userAnswer: string,
    usedAI: string
) {

    const result = await generateText({

        model: google('gemini-2.5-flash-lite'),

        system: `
You are a cognitive dependency scoring agent.

Your task:
1. Detect AI dependency
2. Generate dependency score out of 100
3. Classify:
   - Low
   - Medium
   - High
        `,

        prompt: `
User Answer:
${userAnswer}

Used AI:
${usedAI}
        `
    });

    return result.text;
}