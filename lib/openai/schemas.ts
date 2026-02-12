import { z } from 'zod'

// Persona Generation Schema
export const PersonaSchema = z.object({
  name: z.string(),
  age: z.number(),
  gender: z.string(),
  profession: z.string(),
  description: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  tag: z.string()
})

export const PersonasResponseSchema = z.object({
  personas: z.array(PersonaSchema)
})

export type PersonaGenerated = z.infer<typeof PersonaSchema>
export type PersonasResponse = z.infer<typeof PersonasResponseSchema>

// JSON Schema for OpenAI (strict mode compatible)
export const personasJsonSchema = {
  type: 'object',
  properties: {
    personas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          gender: { type: 'string' },
          profession: { type: 'string' },
          description: { type: 'string' },
          difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
          tag: { type: 'string' }
        },
        required: ['name', 'age', 'gender', 'profession', 'description', 'difficulty', 'tag'],
        additionalProperties: false
      }
    }
  },
  required: ['personas'],
  additionalProperties: false
}

// Scenario Generation Schema
export const ScenarioSchema = z.object({
  name: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  goal: z.string(),
  expectedOutcome: z.string()
})

export const ScenariosResponseSchema = z.object({
  scenarios: z.array(ScenarioSchema)
})

export type ScenarioGenerated = z.infer<typeof ScenarioSchema>
export type ScenariosResponse = z.infer<typeof ScenariosResponseSchema>

export const scenariosJsonSchema = {
  type: 'object',
  properties: {
    scenarios: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
          goal: { type: 'string' },
          expectedOutcome: { type: 'string' }
        },
        required: ['name', 'difficulty', 'goal', 'expectedOutcome'],
        additionalProperties: false
      }
    }
  },
  required: ['scenarios'],
  additionalProperties: false
}

// Discussion Guide Generation Schema
export const DiscussionGuideSchema = z.object({
  name: z.string(),
  objective: z.string(),
  steps: z.array(z.string()),
  behaviors: z.array(z.string()),
  successCriteria: z.array(z.string())
})

export const DiscussionGuideResponseSchema = z.object({
  guide: DiscussionGuideSchema
})

export type DiscussionGuideGenerated = z.infer<typeof DiscussionGuideSchema>
export type DiscussionGuideResponse = z.infer<typeof DiscussionGuideResponseSchema>

export const discussionGuideJsonSchema = {
  type: 'object',
  properties: {
    guide: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        objective: { type: 'string' },
        steps: {
          type: 'array',
          items: { type: 'string' }
        },
        behaviors: {
          type: 'array',
          items: { type: 'string' }
        },
        successCriteria: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['name', 'objective', 'steps', 'behaviors', 'successCriteria'],
      additionalProperties: false
    }
  },
  required: ['guide'],
  additionalProperties: false
}

// Evaluation Schema (for Phase 4)
export const FlaggedTurnSchema = z.object({
  turnIndex: z.number(),
  severity: z.enum(['warning', 'error']),
  reason: z.string()
})

export const CategoryScoresSchema = z.object({
  goalAchievement: z.number().min(0).max(10),
  objectionHandling: z.number().min(0).max(10),
  stayedOnScript: z.number().min(0).max(10),
  naturalConversation: z.number().min(0).max(10),
  brandCompliance: z.number().min(0).max(10)
})

export const EvaluationSchema = z.object({
  overallScore: z.number().min(0).max(10),
  summary: z.string(),
  status: z.enum(['Passed', 'Review', 'Failed']),
  flaggedTurns: z.array(FlaggedTurnSchema),
  categoryScores: CategoryScoresSchema
})

export type EvaluationResult = z.infer<typeof EvaluationSchema>

export const evaluationJsonSchema = {
  type: 'object',
  properties: {
    overallScore: { type: 'number', minimum: 0, maximum: 10 },
    summary: { type: 'string' },
    status: { type: 'string', enum: ['Passed', 'Review', 'Failed'] },
    flaggedTurns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          turnIndex: { type: 'number' },
          severity: { type: 'string', enum: ['warning', 'error'] },
          reason: { type: 'string' }
        },
        required: ['turnIndex', 'severity', 'reason'],
        additionalProperties: false
      }
    },
    categoryScores: {
      type: 'object',
      properties: {
        goalAchievement: { type: 'number', minimum: 0, maximum: 10 },
        objectionHandling: { type: 'number', minimum: 0, maximum: 10 },
        stayedOnScript: { type: 'number', minimum: 0, maximum: 10 },
        naturalConversation: { type: 'number', minimum: 0, maximum: 10 },
        brandCompliance: { type: 'number', minimum: 0, maximum: 10 }
      },
      required: ['goalAchievement', 'objectionHandling', 'stayedOnScript', 'naturalConversation', 'brandCompliance'],
      additionalProperties: false
    }
  },
  required: ['overallScore', 'summary', 'status', 'flaggedTurns', 'categoryScores'],
  additionalProperties: false
}
