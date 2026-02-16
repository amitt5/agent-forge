// Database transformation utilities (snake_case <-> camelCase)

import type {
  Project,
  AgentConfig,
  Persona,
  Scenario,
  TestScript,
  TestRun,
  TestResult,
  VersionHistory,
  Improvement,
  DbProject,
  DbAgentConfig,
  DbPersona,
  DbScenario,
  DbTestScript,
  DbTestRun,
  DbTestResult,
  DbVersionHistory,
  DbImprovement
} from '@/types'

// Project transformations
export function dbToProject(db: DbProject): Project {
  return {
    id: db.id,
    name: db.name,
    tag: db.tag,
    vapiAssistantId: db.vapi_assistant_id,
    currentVersion: db.current_version,
    latestAvgScore: db.latest_avg_score,
    lastTested: db.last_tested,
    testsRun: db.tests_run,
    status: db.status,
    openIssues: db.open_issues,
    iterationsCompleted: db.iterations_completed,
    createdAt: db.created_at,
    updatedAt: db.updated_at
  }
}

export function projectToDb(project: Partial<Project>): Partial<DbProject> {
  const db: Partial<DbProject> = {}

  if (project.id !== undefined) db.id = project.id
  if (project.name !== undefined) db.name = project.name
  if (project.tag !== undefined) db.tag = project.tag
  if (project.vapiAssistantId !== undefined) db.vapi_assistant_id = project.vapiAssistantId
  if (project.currentVersion !== undefined) db.current_version = project.currentVersion
  if (project.latestAvgScore !== undefined) db.latest_avg_score = project.latestAvgScore
  if (project.lastTested !== undefined) db.last_tested = project.lastTested
  if (project.testsRun !== undefined) db.tests_run = project.testsRun
  if (project.status !== undefined) db.status = project.status
  if (project.openIssues !== undefined) db.open_issues = project.openIssues
  if (project.iterationsCompleted !== undefined) db.iterations_completed = project.iterationsCompleted

  return db
}

// AgentConfig transformations
export function dbToAgentConfig(db: DbAgentConfig): AgentConfig {
  return {
    id: db.id,
    projectId: db.project_id,
    version: db.version,
    agentName: db.agent_name,
    agentType: db.agent_type,
    primaryGoal: db.primary_goal,
    tonePersonality: db.tone_personality,
    mustNeverDo: db.must_never_do,
    targetGroup: db.target_group,
    systemPrompt: db.system_prompt,
    isCurrent: db.is_current,
    createdAt: db.created_at
  }
}

export function agentConfigToDb(config: Partial<AgentConfig>): Partial<DbAgentConfig> {
  const db: Partial<DbAgentConfig> = {}

  if (config.id !== undefined) db.id = config.id
  if (config.projectId !== undefined) db.project_id = config.projectId
  if (config.version !== undefined) db.version = config.version
  if (config.agentName !== undefined) db.agent_name = config.agentName
  if (config.agentType !== undefined) db.agent_type = config.agentType
  if (config.primaryGoal !== undefined) db.primary_goal = config.primaryGoal
  if (config.tonePersonality !== undefined) db.tone_personality = config.tonePersonality
  if (config.mustNeverDo !== undefined) db.must_never_do = config.mustNeverDo
  if (config.targetGroup !== undefined) db.target_group = config.targetGroup
  if (config.systemPrompt !== undefined) db.system_prompt = config.systemPrompt
  if (config.isCurrent !== undefined) db.is_current = config.isCurrent

  return db
}

// Persona transformations
export function dbToPersona(db: DbPersona): Persona {
  return {
    id: db.id,
    projectId: db.project_id,
    name: db.name,
    age: db.age,
    gender: db.gender,
    profession: db.profession,
    description: db.description,
    difficulty: db.difficulty,
    tag: db.tag,
    approved: db.approved,
    aiGenerated: db.ai_generated,
    createdAt: db.created_at
  }
}

export function personaToDb(persona: Partial<Persona>): Partial<DbPersona> {
  const db: Partial<DbPersona> = {}

  if (persona.id !== undefined) db.id = persona.id
  if (persona.projectId !== undefined) db.project_id = persona.projectId
  if (persona.name !== undefined) db.name = persona.name
  if (persona.age !== undefined) db.age = persona.age
  if (persona.gender !== undefined) db.gender = persona.gender
  if (persona.profession !== undefined) db.profession = persona.profession
  if (persona.description !== undefined) db.description = persona.description
  if (persona.difficulty !== undefined) db.difficulty = persona.difficulty
  if (persona.tag !== undefined) db.tag = persona.tag
  if (persona.approved !== undefined) db.approved = persona.approved
  if (persona.aiGenerated !== undefined) db.ai_generated = persona.aiGenerated

  return db
}

// Scenario transformations
export function dbToScenario(db: DbScenario): Scenario {
  return {
    id: db.id,
    projectId: db.project_id,
    name: db.name,
    personaId: db.persona_id,
    difficulty: db.difficulty,
    goal: db.goal,
    expectedOutcome: db.expected_outcome,
    status: db.status,
    aiGenerated: db.ai_generated,
    createdAt: db.created_at
  }
}

export function scenarioToDb(scenario: Partial<Scenario>): Partial<DbScenario> {
  const db: Partial<DbScenario> = {}

  if (scenario.id !== undefined) db.id = scenario.id
  if (scenario.projectId !== undefined) db.project_id = scenario.projectId
  if (scenario.name !== undefined) db.name = scenario.name
  if (scenario.personaId !== undefined) db.persona_id = scenario.personaId
  if (scenario.difficulty !== undefined) db.difficulty = scenario.difficulty
  if (scenario.goal !== undefined) db.goal = scenario.goal
  if (scenario.expectedOutcome !== undefined) db.expected_outcome = scenario.expectedOutcome
  if (scenario.status !== undefined) db.status = scenario.status
  if (scenario.aiGenerated !== undefined) db.ai_generated = scenario.aiGenerated

  return db
}

// TestScript transformations
export function dbToTestScript(db: DbTestScript): TestScript {
  return {
    id: db.id,
    projectId: db.project_id,
    scenarioId: db.scenario_id,
    name: db.name,
    goal: db.goal,
    expectedOutcome: db.expected_outcome,
    turns: db.turns,
    status: db.status,
    aiGenerated: db.ai_generated,
    scriptData: db.script_data,
    createdAt: db.created_at
  }
}

export function testScriptToDb(script: Partial<TestScript>): Partial<DbTestScript> {
  const db: Partial<DbTestScript> = {}

  if (script.id !== undefined) db.id = script.id
  if (script.projectId !== undefined) db.project_id = script.projectId
  if (script.scenarioId !== undefined) db.scenario_id = script.scenarioId
  if (script.name !== undefined) db.name = script.name
  if (script.goal !== undefined) db.goal = script.goal
  if (script.expectedOutcome !== undefined) db.expected_outcome = script.expectedOutcome
  if (script.turns !== undefined) db.turns = script.turns
  if (script.status !== undefined) db.status = script.status
  if (script.aiGenerated !== undefined) db.ai_generated = script.aiGenerated
  if (script.scriptData !== undefined) db.script_data = script.scriptData

  return db
}

// TestRun transformations
export function dbToTestRun(db: DbTestRun): TestRun {
  return {
    id: db.id,
    projectId: db.project_id,
    runNumber: db.run_number,
    agentConfigId: db.agent_config_id,
    totalTests: db.total_tests,
    avgScore: db.avg_score,
    flaggedCount: db.flagged_count,
    status: db.status,
    completedAt: db.completed_at,
    createdAt: db.created_at
  }
}

export function testRunToDb(run: Partial<TestRun>): Partial<DbTestRun> {
  const db: Partial<DbTestRun> = {}

  if (run.id !== undefined) db.id = run.id
  if (run.projectId !== undefined) db.project_id = run.projectId
  if (run.runNumber !== undefined) db.run_number = run.runNumber
  if (run.agentConfigId !== undefined) db.agent_config_id = run.agentConfigId
  if (run.totalTests !== undefined) db.total_tests = run.totalTests
  if (run.avgScore !== undefined) db.avg_score = run.avgScore
  if (run.flaggedCount !== undefined) db.flagged_count = run.flaggedCount
  if (run.status !== undefined) db.status = run.status
  if (run.completedAt !== undefined) db.completed_at = run.completedAt

  return db
}

// TestResult transformations
export function dbToTestResult(db: DbTestResult): TestResult {
  return {
    id: db.id,
    testRunId: db.test_run_id,
    testScriptId: db.test_script_id,
    personaId: db.persona_id,
    score: db.score,
    summary: db.summary,
    status: db.status,
    conversationData: db.conversation_data,
    evaluationData: db.evaluation_data,
    createdAt: db.created_at
  }
}

export function testResultToDb(result: Partial<TestResult>): Partial<DbTestResult> {
  const db: Partial<DbTestResult> = {}

  if (result.id !== undefined) db.id = result.id
  if (result.testRunId !== undefined) db.test_run_id = result.testRunId
  if (result.testScriptId !== undefined) db.test_script_id = result.testScriptId
  if (result.personaId !== undefined) db.persona_id = result.personaId
  if (result.score !== undefined) db.score = result.score
  if (result.summary !== undefined) db.summary = result.summary
  if (result.status !== undefined) db.status = result.status
  if (result.conversationData !== undefined) db.conversation_data = result.conversationData
  if (result.evaluationData !== undefined) db.evaluation_data = result.evaluationData

  return db
}

// VersionHistory transformations
export function dbToVersionHistory(db: DbVersionHistory): VersionHistory {
  return {
    id: db.id,
    projectId: db.project_id,
    version: db.version,
    agentConfigId: db.agent_config_id,
    testRunId: db.test_run_id,
    avgScore: db.avg_score,
    testsRun: db.tests_run,
    changes: db.changes,
    improvementsApplied: db.improvements_applied,
    createdAt: db.created_at
  }
}

export function versionHistoryToDb(history: Partial<VersionHistory>): Partial<DbVersionHistory> {
  const db: Partial<DbVersionHistory> = {}

  if (history.id !== undefined) db.id = history.id
  if (history.projectId !== undefined) db.project_id = history.projectId
  if (history.version !== undefined) db.version = history.version
  if (history.agentConfigId !== undefined) db.agent_config_id = history.agentConfigId
  if (history.testRunId !== undefined) db.test_run_id = history.testRunId
  if (history.avgScore !== undefined) db.avg_score = history.avgScore
  if (history.testsRun !== undefined) db.tests_run = history.testsRun
  if (history.changes !== undefined) db.changes = history.changes
  if (history.improvementsApplied !== undefined) db.improvements_applied = history.improvementsApplied

  return db
}

// Improvement transformations
export function dbToImprovement(db: DbImprovement): Improvement {
  return {
    id: db.id,
    projectId: db.project_id,
    title: db.title,
    appearedIn: db.appeared_in,
    area: db.area,
    severity: db.severity,
    problem: db.problem,
    oldText: db.old_text,
    newText: db.new_text,
    status: db.status,
    createdAt: db.created_at
  }
}

export function improvementToDb(improvement: Partial<Improvement>): Partial<DbImprovement> {
  const db: Partial<DbImprovement> = {}

  if (improvement.id !== undefined) db.id = improvement.id
  if (improvement.projectId !== undefined) db.project_id = improvement.projectId
  if (improvement.title !== undefined) db.title = improvement.title
  if (improvement.appearedIn !== undefined) db.appeared_in = improvement.appearedIn
  if (improvement.area !== undefined) db.area = improvement.area
  if (improvement.severity !== undefined) db.severity = improvement.severity
  if (improvement.problem !== undefined) db.problem = improvement.problem
  if (improvement.oldText !== undefined) db.old_text = improvement.oldText
  if (improvement.newText !== undefined) db.new_text = improvement.newText
  if (improvement.status !== undefined) db.status = improvement.status

  return db
}
