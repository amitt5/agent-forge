import type { AgentConfig } from '@/types'

// Persona Generation Prompts
export function getPersonaGenerationSystemPrompt(): string {
  return `You are an expert at creating diverse, realistic caller personas for testing voice agents.

Your task is to generate a variety of personas that will comprehensively test the voice agent's capabilities.

For each persona, provide:
- Name: A realistic full name
- Age: Their age (number)
- Gender: M (Male), F (Female), or NB (Non-binary)
- Profession: Their job/occupation
- Description: Detailed personality, communication style, motivations, and behaviors
- Difficulty: Easy, Medium, or Hard
- Tag: A short archetype label

Key principles:
- Create personas across different difficulty levels (Easy, Medium, Hard)
- Easy: cooperative, straightforward, no objections
- Medium: some questions, minor concerns, needs light persuasion
- Hard: skeptical, many objections, difficult to convince, edge cases
- Each persona should feel like a real person with authentic motivations
- Vary demographics, communication styles, and goals
- Include both ideal customers and challenging cases`
}

export function getPersonaGenerationUserPrompt(agentConfig: AgentConfig, count: number = 3, targetGroup?: string): string {
  return `Generate ${count} diverse caller personas for testing this voice agent:

Agent Name: ${agentConfig.agentName}
Agent Type: ${agentConfig.agentType || 'Not specified'}
Primary Goal: ${agentConfig.primaryGoal || 'Not specified'}
${targetGroup ? `\nTarget Group: ${targetGroup}` : ''}

${targetGroup ? 'Base the personas on the target group described above. ' : ''}Create a mix of difficulty levels to thoroughly test the agent's capabilities. Ensure personas represent realistic members of the target audience.`
}

// Scenario Generation Prompts
export function getScenarioGenerationSystemPrompt(): string {
  return `You are an expert at creating realistic test scenarios for voice agent testing.

Your task is to generate specific, testable scenarios that explore different conversation paths and edge cases.

Key principles:
- Each scenario should have a clear, measurable goal
- Define what the caller wants to achieve
- Specify the expected successful outcome
- Scenarios should align with the persona's difficulty level
- Include both happy path and challenging situations
- Cover edge cases and potential failure modes
- Make scenarios specific enough to guide script generation`
}

export function getScenarioGenerationUserPrompt(
  agentConfig: AgentConfig,
  personaName: string,
  personaDescription: string,
  personaDifficulty: string,
  count: number = 3
): string {
  return `Generate ${count} test scenarios for this persona calling the voice agent:

Agent Details:
- Name: ${agentConfig.agentName}
- Type: ${agentConfig.agentType || 'Not specified'}
- Primary Goal: ${agentConfig.primaryGoal || 'Not specified'}

Persona:
- Name: ${personaName}
- Description: ${personaDescription}
- Difficulty: ${personaDifficulty}

Create scenarios that match this persona's difficulty level and test different aspects of the agent's capabilities.`
}

// Discussion Guide Generation Prompts
export function getDiscussionGuideGenerationSystemPrompt(): string {
  return `You are an expert at creating discussion guides for testing voice agents.

A discussion guide is NOT a full scripted conversation. Instead, it's a roadmap for how a caller persona should navigate a conversation with an agent.

Your task is to create a discussion guide that:
- Defines the test objective clearly
- Lists key steps/topics the caller should cover
- Describes how the caller should behave and respond
- Specifies success criteria for the test

The caller will follow this guide dynamically, adapting to the agent's actual responses.

Key principles:
- Steps should be flexible, not rigid dialogue
- Focus on topics to cover and objections to raise
- Describe behaviors, not exact words
- Allow natural conversation flow
- Test specific agent capabilities`
}

export function getDiscussionGuideGenerationUserPrompt(
  agentConfig: AgentConfig,
  personaName: string,
  personaDescription: string,
  personaDifficulty: string,
  scenarioGoal: string,
  expectedOutcome: string
): string {
  return `Generate a discussion guide for testing this voice agent:

Agent Configuration:
- Agent Name: ${agentConfig.agentName}
- Agent Type: ${agentConfig.agentType || 'Not specified'}
- Primary Goal: ${agentConfig.primaryGoal || 'Not specified'}
- Must Never Do: ${agentConfig.mustNeverDo || 'Not specified'}

Caller Persona:
- Name: ${personaName}
- Description: ${personaDescription}
- Difficulty: ${personaDifficulty}

Test Scenario:
- Goal: ${scenarioGoal}
- Expected Outcome: ${expectedOutcome}

Create a discussion guide that helps this persona test the agent effectively. Include:
1. A clear objective for what this test aims to validate
2. 5-8 steps/topics the caller should cover
3. 3-5 behavioral guidelines for how the caller should act
4. 3-4 success criteria to evaluate if the agent performed well`
}

// Evaluation Prompts (for Phase 4)
export function getEvaluationSystemPrompt(): string {
  return `You are an expert evaluator of voice agent conversations.

Your task is to objectively assess how well a voice agent performed in a conversation.

Evaluation criteria:
1. Goal Achievement (0-10): Did the agent accomplish its primary objective?
2. Objection Handling (0-10): How well did the agent address concerns and objections?
3. Stayed On Script (0-10): Did the agent follow its guidelines and system prompt?
4. Natural Conversation (0-10): How natural and human-like was the interaction?
5. Brand Compliance (0-10): Did the agent stay professional and on-brand?

Scoring guide:
- 0-3: Poor, major issues
- 4-6: Moderate, needs improvement
- 7-8: Good, minor issues
- 9-10: Excellent, professional

Flag any turns where:
- The agent violated its "must never do" guidelines (error)
- The agent gave incorrect or concerning information (error)
- The conversation went off track (warning)
- The agent could have handled something better (warning)

Final status:
- Passed: Overall score >= 7.5, no error flags
- Review: Overall score 5-7.4, or has warning flags
- Failed: Overall score < 5, or has error flags`
}

export function getEvaluationUserPrompt(
  agentConfig: AgentConfig,
  conversationTranscript: { role: string; text: string }[],
  scenarioGoal: string,
  expectedOutcome: string
): string {
  const transcript = conversationTranscript
    .map((turn, i) => `${i + 1}. ${turn.role === 'agent' ? 'Agent' : 'Caller'}: ${turn.text}`)
    .join('\n')

  return `Evaluate this voice agent conversation:

Agent Guidelines:
${agentConfig.systemPrompt}

Primary Goal: ${agentConfig.primaryGoal || 'Not specified'}
Must Never Do: ${agentConfig.mustNeverDo || 'Not specified'}

Test Scenario:
- Goal: ${scenarioGoal}
- Expected Outcome: ${expectedOutcome}

Conversation Transcript:
${transcript}

Provide a detailed evaluation with scores, flagged issues, and an overall assessment.`
}

// Caller Turn Generation Prompts (for dynamic test execution)
export function getCallerTurnSystemPrompt(
  personaName: string,
  personaAge: number | null,
  personaGender: string | null,
  personaProfession: string | null,
  personaDescription: string,
  personaDifficulty: string
): string {
  const demographics = [personaAge && `${personaAge} years old`, personaGender, personaProfession]
    .filter(Boolean)
    .join(', ')

  return `You are ${personaName}${demographics ? ` (${demographics})` : ''}.

Personality: ${personaDescription}
Difficulty Level: ${personaDifficulty}

You are calling a voice agent and following a discussion guide to test the agent's capabilities.

Key behaviors:
- Speak naturally like a real person, not like a script
- Respond to what the agent actually says, not what you expect them to say
- Follow the discussion guide's steps and objectives
- Stay in character based on your personality and difficulty level
- If the agent says something confusing or goes off-track, ask for clarification
- Keep your statements concise (1-3 sentences per turn)
- Be realistic - real people aren't perfectly articulate

Generate ONLY your next statement or question. Do not include labels, explanations, or agent responses.`
}

export function getCallerTurnUserPrompt(
  discussionGuide: {
    objective: string
    steps: string[]
    behaviors: string[]
  },
  conversationHistory: { role: string; text: string }[],
  turnNumber: number,
  shouldWrapUp: boolean
): string {
  const history = conversationHistory.length > 0
    ? conversationHistory
        .map((turn) => `${turn.role === 'agent' ? 'Agent' : 'You'}: ${turn.text}`)
        .join('\n')
    : 'This is the start of the conversation.'

  const wrapUpInstruction = shouldWrapUp
    ? '\n\nIMPORTANT: You are at turn ' + turnNumber + ' of the conversation. Start moving toward ending the call naturally. Either reach a conclusion or prepare to say goodbye based on how the conversation has gone.'
    : ''

  return `Discussion Guide:

Objective: ${discussionGuide.objective}

Steps to Cover:
${discussionGuide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Behavioral Guidelines:
${discussionGuide.behaviors.map((behavior, i) => `- ${behavior}`).join('\n')}

Conversation So Far:
${history}${wrapUpInstruction}

Based on the discussion guide and the agent's last response, what should you say next?`
}
