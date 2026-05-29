import { tool } from 'ai';
import { z } from 'zod';

// Weather Tool
export const weatherTool = tool({
    description: 'Get the weather in a location',
    inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
    }),
});

// Activity Recommendation Tool
export const activityTool = tool({
    description: 'Get the activities in a location',
    inputSchema: z.object({
        location: z
            .string()
            .describe('The location to get the activities for'),
    }),
    execute: async ({ location }) => ({
        location,
        activities: ['hiking', 'swimming', 'sightseeing'],
    }),
});

// Export all tools
export const tools = {
    weather: weatherTool,
    activity: activityTool,
};