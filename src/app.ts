import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { reasoningAgent } from './agents/reasoningAgent';
import { dependencyAgent } from './agents/dependencyAgent';
import { taskAgent } from './agents/taskAgent';

import {
    calculateReasoningScore,
    calculateDependencyScore,
    getRiskLevel
} from './services/scoringService';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

// =====================================
// ANALYZE USER RESPONSE
// =====================================

app.post('/analyze', async (req, res) => {

    try {

        const { userAnswer, usedAI } = req.body;

        if (!userAnswer) {

            return res.status(400).json({
                error: 'User answer required'
            });

        }

        if (!apiKey) {

            return res.status(400).json({
                error: 'API key missing'
            });

        }

        // =====================================
        // RULE-BASED SCORING
        // =====================================

        const reasoningScore =
            calculateReasoningScore(userAnswer);

        const dependencyScore =
            calculateDependencyScore(usedAI);

        const riskLevel =
            getRiskLevel(dependencyScore);

        // =====================================
        // AGENT 1 : REASONING
        // =====================================

        const reasoningResult =
            await reasoningAgent(userAnswer);

        // =====================================
        // AGENT 2 : DEPENDENCY
        // =====================================

        const dependencyResult =
            await dependencyAgent(
                userAnswer,
                usedAI
            );

        // =====================================
        // MASTER AI AGENT
        // =====================================

        const finalResult =
            await generateText({

                model:
                    google('gemini-2.5-flash-lite'),

                system: `
You are a cognitive analysis AI.

Return ONLY valid JSON.

JSON format:

{
  "independentThinking": string,
  "summary": string,
  "improvement": string
}
                `,

                prompt: `
RULE BASED REASONING SCORE:
${reasoningScore}

RULE BASED DEPENDENCY SCORE:
${dependencyScore}

RISK LEVEL:
${riskLevel}

REASONING AGENT OUTPUT:
${reasoningResult}

DEPENDENCY AGENT OUTPUT:
${dependencyResult}
                `
            });

        // =====================================
        // CLEAN JSON
        // =====================================

        const cleanText =
            finalResult.text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

        const parsedAI =
            JSON.parse(cleanText);

        // =====================================
        // FINAL RESPONSE
        // =====================================

        res.json({

            reasoningScore,

            dependencyScore,

            riskLevel,

            independentThinking:
                parsedAI.independentThinking,

            summary:
                parsedAI.summary,

            improvement:
                parsedAI.improvement

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: 'Something went wrong'
        });

    }

});

// =====================================
// GENERATE TASK
// =====================================

app.get('/task', async (req, res) => {

    try {

        const task =
            await taskAgent();

        res.json({
            task
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error:
                'Failed to generate task'
        });

    }

});

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});