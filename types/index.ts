// Core TypeScript interfaces matching database schema

export interface Project {
  id: string
  name: string
  tag: string
  vapiAssistantId: string | null
  currentVersion: string
  latestAvgScore: number | null
  lastTested: string | null
  testsRun: number
  status: 'Active' | 'Needs Attention' | 'Archived'
  openIssues: number
  iterationsCompleted: number
  createdAt: string
  updatedAt: string
}

export interface AgentConfig {
  id: string
  projectId: string
  version: string
  agentName: string
  agentType: string | null
  primaryGoal: string | null
  tonePersonality: string | null
  mustNeverDo: string | null
  systemPrompt: string
  isCurrent: boolean
  createdAt: string
}

export interface Persona {
  id: string
  projectId: string
  name: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tag: string | null
  approved: boolean
  aiGenerated: boolean
  createdAt: string
}

export interface Scenario {
  id: string
  projectId: string
  name: string
  personaId: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  goal: string
  expectedOutcome: string
  status: 'Approved' | 'Pending' | 'Archived'
  aiGenerated: boolean
  createdAt: string
}

export interface ScriptTurn {
  role: 'agent' | 'caller'
  text: string
}

export interface TestScript {
  id: string
  projectId: string
  scenarioId: string
  name: string
  turns: number
  status: 'Approved' | 'Pending' | 'Archived'
  aiGenerated: boolean
  scriptData: ScriptTurn[]
  createdAt: string
}

export interface TestRun {
  id: string
  projectId: string
  runNumber: number
  agentConfigId: string | null
  totalTests: number
  avgScore: number | null
  flaggedCount: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  completedAt: string | null
  createdAt: string
}

export interface FlaggedTurn {
  turnIndex: number
  severity: 'warning' | 'error'
  reason: string
}

export interface CategoryScores {
  goalAchievement: number
  objectionHandling: number
  stayedOnScript: number
  naturalConversation: number
  brandCompliance: number
}

export interface EvaluationData {
  overallScore: number
  summary: string
  status: 'Passed' | 'Review' | 'Failed'
  flaggedTurns: FlaggedTurn[]
  categoryScores: CategoryScores
}

export interface ConversationTurn {
  role: 'agent' | 'caller'
  text: string
  timestamp?: string
}

export interface TestResult {
  id: string
  testRunId: string
  testScriptId: string
  personaId: string
  score: number
  summary: string
  status: 'Passed' | 'Review' | 'Failed'
  conversationData: ConversationTurn[]
  evaluationData: EvaluationData | null
  createdAt: string
}

export interface VersionHistory {
  id: string
  projectId: string
  version: string
  agentConfigId: string | null
  testRunId: string | null
  avgScore: number | null
  testsRun: number | null
  changes: string[]
  improvementsApplied: number
  createdAt: string
}

export interface Improvement {
  id: string
  projectId: string
  title: string
  appearedIn: string
  area: 'Prompt' | 'Conversation Flow' | 'Guardrails'
  severity: 'Low' | 'Medium' | 'High'
  problem: string
  oldText: string | null
  newText: string | null
  status: 'Pending' | 'Approved' | 'Rejected' | 'Applied'
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  success: true
  data: T
  meta?: {
    page?: number
    total?: number
    limit?: number
  }
}

export interface ApiError {
  success: false
  error: {
    message: string
    code: string
    details?: any
  }
}

// Database column name mapping (snake_case to camelCase)
export type DbProject = {
  id: string
  name: string
  tag: string
  vapi_assistant_id: string | null
  current_version: string
  latest_avg_score: number | null
  last_tested: string | null
  tests_run: number
  status: 'Active' | 'Needs Attention' | 'Archived'
  open_issues: number
  iterations_completed: number
  created_at: string
  updated_at: string
}

export type DbAgentConfig = {
  id: string
  project_id: string
  version: string
  agent_name: string
  agent_type: string | null
  primary_goal: string | null
  tone_personality: string | null
  must_never_do: string | null
  system_prompt: string
  is_current: boolean
  created_at: string
}

export type DbPersona = {
  id: string
  project_id: string
  name: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tag: string | null
  approved: boolean
  ai_generated: boolean
  created_at: string
}

export type DbScenario = {
  id: string
  project_id: string
  name: string
  persona_id: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  goal: string
  expected_outcome: string
  status: 'Approved' | 'Pending' | 'Archived'
  ai_generated: boolean
  created_at: string
}

export type DbTestScript = {
  id: string
  project_id: string
  scenario_id: string
  name: string
  turns: number
  status: 'Approved' | 'Pending' | 'Archived'
  ai_generated: boolean
  script_data: ScriptTurn[]
  created_at: string
}

export type DbTestRun = {
  id: string
  project_id: string
  run_number: number
  agent_config_id: string | null
  total_tests: number
  avg_score: number | null
  flagged_count: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  completed_at: string | null
  created_at: string
}

export type DbTestResult = {
  id: string
  test_run_id: string
  test_script_id: string
  persona_id: string
  score: number
  summary: string
  status: 'Passed' | 'Review' | 'Failed'
  conversation_data: ConversationTurn[]
  evaluation_data: EvaluationData | null
  created_at: string
}

export type DbVersionHistory = {
  id: string
  project_id: string
  version: string
  agent_config_id: string | null
  test_run_id: string | null
  avg_score: number | null
  tests_run: number | null
  changes: string[]
  improvements_applied: number
  created_at: string
}

export type DbImprovement = {
  id: string
  project_id: string
  title: string
  appeared_in: string
  area: 'Prompt' | 'Conversation Flow' | 'Guardrails'
  severity: 'Low' | 'Medium' | 'High'
  problem: string
  old_text: string | null
  new_text: string | null
  status: 'Pending' | 'Approved' | 'Rejected' | 'Applied'
  created_at: string
}
