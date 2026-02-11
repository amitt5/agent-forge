import { generateWithStructure } from '@/lib/openai/client'
import { getEvaluationSystemPrompt, getEvaluationUserPrompt } from '@/lib/openai/prompts'
import { evaluationJsonSchema, type EvaluationResult } from '@/lib/openai/schemas'
import type { AgentConfig, ConversationTurn } from '@/types'

/**
 * Evaluate a conversation between an agent and a caller
 * Returns a structured evaluation with scores and feedback
 */
export async function evaluateConversation(
  agentConfig: AgentConfig,
  conversationTranscript: ConversationTurn[],
  scenarioGoal: string,
  expectedOutcome: string
): Promise<EvaluationResult> {
  const systemPrompt = getEvaluationSystemPrompt()
  const userPrompt = getEvaluationUserPrompt(
    agentConfig,
    conversationTranscript,
    scenarioGoal,
    expectedOutcome
  )

  const evaluation = await generateWithStructure<EvaluationResult>(
    systemPrompt,
    userPrompt,
    evaluationJsonSchema,
    { temperature: 0.3 } // Lower temperature for more consistent evaluations
  )

  return evaluation
}

/**
 * Calculate an overall status based on score and flags
 */
export function determineStatus(score: number, hasErrors: boolean): 'Passed' | 'Review' | 'Failed' {
  if (hasErrors || score < 5) return 'Failed'
  if (score < 7.5) return 'Review'
  return 'Passed'
}

/**
 * Format conversation for display
 */
export function formatConversation(turns: Array<{ role: string; message: string }>): ConversationTurn[] {
  return turns.map(turn => ({
    role: turn.role === 'assistant' ? 'agent' : 'caller',
    text: turn.message
  }))
}
