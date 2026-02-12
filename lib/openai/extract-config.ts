import { generateWithStructure } from './client'
import { z } from 'zod'

const ConfigExtractionSchema = z.object({
  agentName: z.string(),
  agentType: z.string(),
  primaryGoal: z.string(),
  tonePersonality: z.string(),
  mustNeverDo: z.string(),
  targetGroup: z.string()
})

export type ExtractedConfig = z.infer<typeof ConfigExtractionSchema>

const configExtractionJsonSchema = {
  type: 'object',
  properties: {
    agentName: { type: 'string' },
    agentType: { type: 'string' },
    primaryGoal: { type: 'string' },
    tonePersonality: { type: 'string' },
    mustNeverDo: { type: 'string' },
    targetGroup: { type: 'string' }
  },
  required: ['agentName', 'agentType', 'primaryGoal', 'tonePersonality', 'mustNeverDo', 'targetGroup'],
  additionalProperties: false
}

const systemPrompt = `You are an expert at analyzing voice agent system prompts and extracting key configuration details.

Your task is to read a system prompt and extract:
1. Agent Name: A short, descriptive name for this agent (2-4 words)
2. Agent Type: The type/role of the agent (e.g., "Sales Assistant", "Customer Support", "Technical Recruiter")
3. Primary Goal: The main objective or purpose of the agent (1-2 sentences)
4. Tone & Personality: How the agent should sound and behave (1-2 sentences)
5. Must Never Do: Critical guardrails or things the agent must never do (1-3 bullet points)
6. Target Group: Who typically calls/interacts with this agent (demographics, characteristics, needs - 1-2 sentences)

Be concise and extract only what's clearly stated or strongly implied in the prompt.`

export async function extractConfigFromPrompt(prompt: string): Promise<ExtractedConfig> {
  const userPrompt = `Analyze this voice agent system prompt and extract the configuration details:

${prompt}

Extract the agent name, type, primary goal, tone & personality, must never do guidelines, and target group.`

  const extracted = await generateWithStructure<ExtractedConfig>(
    systemPrompt,
    userPrompt,
    configExtractionJsonSchema,
    { temperature: 0.3 }
  )

  return extracted
}
