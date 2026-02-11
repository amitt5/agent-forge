Perfect! I've completed the comprehensive implementation plan. The plan covers:                   
                                                                                                    
  ✅ Complete database schema for Supabase with 8 tables
  ✅ API architecture with 28+ routes                                                               
  ✅ OpenAI integration for AI generation and evaluation                                            
  ✅ VAPI integration for text-based testing                                                        
  ✅ 6-phase implementation approach (8 days)                                                       
  ✅ Critical path focus on test execution (Phase 4)    
  ✅ Verification strategy with end-to-end testing
  ✅ Risk mitigation for common issues

  The plan is written to /Users/macpro/.claude/plans/vast-riding-sparkle.md and ready for your
  review.

────────────────────────────────────────────────────────────────────────────────────────────────────
 Ready to code?                                                                                     
                                       
 Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 AgentForge MVP Backend Implementation Plan
                                                                                                    
 Context                                                

 AgentForge is a demo frontend (built by v0) for an AI-powered voice agent testing platform.
 Currently, it's a client-side-only prototype with mock data in /lib/data.ts and no backend.

 Goal: Transform it into a functional MVP by adding:
 - Supabase database for data persistence
 - Next.js API routes for backend logic
 - OpenAI integration for AI-powered persona/scenario/script generation and test evaluation
 - VAPI integration for text-based voice agent testing

 MVP Scope: Test execution & evaluation (core value prop) + AI persona/scenario generation. No
 authentication (single-user demo), no improvement auto-suggestions, no cost controls.

 Why: User wants to validate demand before building the full product. Need end-to-end flow working:
  create project → generate test data → run tests via VAPI → evaluate with AI → view results.

 ---
 Implementation Strategy

 Phased Approach (8 Days)

 Phase 1: Foundation (Day 1-2) - Database, types, API infrastructure
 Phase 2: Projects (Day 2-3) - Project CRUD, agent config management
 Phase 3: Test Data (Day 3-4) - AI generation of personas, scenarios, scripts
 Phase 4: Test Execution (Day 4-6) - VAPI integration, evaluation engine, end-to-end flow ⭐
 CRITICAL
 Phase 5: History (Day 6-7) - Version tracking, improvements logging
 Phase 6: Polish (Day 7-8) - VAPI sync/push, loading states, final integration

 ---
 Database Schema (Supabase/Postgres)

 Core Tables

 -- Projects
 CREATE TABLE projects (
   id TEXT PRIMARY KEY,
   name TEXT NOT NULL,
   tag TEXT NOT NULL,
   vapi_assistant_id TEXT,
   current_version TEXT DEFAULT 'v1',
   latest_avg_score DECIMAL(3,1),
   last_tested TIMESTAMP,
   tests_run INTEGER DEFAULT 0,
   status TEXT CHECK (status IN ('Active', 'Needs Attention', 'Archived')),
   open_issues INTEGER DEFAULT 0,
   iterations_completed INTEGER DEFAULT 0,
   created_at TIMESTAMP DEFAULT NOW(),
   updated_at TIMESTAMP DEFAULT NOW()
 );

 -- Agent configurations (versioned prompts)
 CREATE TABLE agent_configs (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
   version TEXT NOT NULL,
   agent_name TEXT NOT NULL,
   agent_type TEXT,
   primary_goal TEXT,
   tone_personality TEXT,
   must_never_do TEXT,
   system_prompt TEXT NOT NULL,
   is_current BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT NOW(),
   UNIQUE(project_id, version)
 );

 -- Personas (caller profiles for testing)
 CREATE TABLE personas (
   id TEXT PRIMARY KEY,
   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
   name TEXT NOT NULL,
   description TEXT NOT NULL,
   difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
   tag TEXT,
   approved BOOLEAN DEFAULT false,
   ai_generated BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT NOW()
 );

 -- Scenarios (test cases)
 CREATE TABLE scenarios (
   id TEXT PRIMARY KEY,
   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
   name TEXT NOT NULL,
   persona_id TEXT REFERENCES personas(id) ON DELETE CASCADE,
   difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
   goal TEXT NOT NULL,
   expected_outcome TEXT NOT NULL,
   status TEXT CHECK (status IN ('Approved', 'Pending', 'Archived')),
   ai_generated BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT NOW()
 );

 -- Test scripts (conversation templates)
 CREATE TABLE test_scripts (
   id TEXT PRIMARY KEY,
   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
   scenario_id TEXT REFERENCES scenarios(id) ON DELETE CASCADE,
   name TEXT NOT NULL,
   turns INTEGER NOT NULL,
   status TEXT CHECK (status IN ('Approved', 'Pending', 'Archived')),
   ai_generated BOOLEAN DEFAULT false,
   script_data JSONB NOT NULL, -- Array of {role: 'agent'|'caller', text: string}
   created_at TIMESTAMP DEFAULT NOW()
 );

 -- Test runs
 CREATE TABLE test_runs (
   id TEXT PRIMARY KEY,
   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
   run_number INTEGER NOT NULL,
   agent_config_id UUID REFERENCES agent_configs(id),
   total_tests INTEGER NOT NULL,
   avg_score DECIMAL(3,1),
   flagged_count INTEGER DEFAULT 0,
   status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')),
   completed_at TIMESTAMP,
   created_at TIMESTAMP DEFAULT NOW(),
   UNIQUE(project_id, run_number)
 );

 -- Test results (individual conversation outcomes)
 CREATE TABLE test_results (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   test_run_id TEXT REFERENCES test_runs(id) ON DELETE CASCADE,
   test_script_id TEXT REFERENCES test_scripts(id),
   persona_id TEXT REFERENCES personas(id),
   score DECIMAL(3,1),
   summary TEXT,
   status TEXT CHECK (status IN ('Passed', 'Review', 'Failed')),
   conversation_data JSONB NOT NULL, -- Full transcript
   evaluation_data JSONB, -- OpenAI's structured evaluation
   created_at TIMESTAMP DEFAULT NOW()
 );

 -- Version history
 CREATE TABLE version_history (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
   version TEXT NOT NULL,
   agent_config_id UUID REFERENCES agent_configs(id),
   test_run_id TEXT REFERENCES test_runs(id),
   avg_score DECIMAL(3,1),
   tests_run INTEGER,
   changes TEXT[],
   improvements_applied INTEGER DEFAULT 0,
   created_at TIMESTAMP DEFAULT NOW()
 );

 -- Improvements (for future MVP expansion)
 CREATE TABLE improvements (
   id TEXT PRIMARY KEY,
   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
   title TEXT NOT NULL,
   appeared_in TEXT NOT NULL,
   area TEXT CHECK (area IN ('Prompt', 'Conversation Flow', 'Guardrails')),
   severity TEXT CHECK (severity IN ('Low', 'Medium', 'High')),
   problem TEXT NOT NULL,
   old_text TEXT,
   new_text TEXT,
   status TEXT CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Applied')),
   created_at TIMESTAMP DEFAULT NOW()
 );

 Essential Indexes

 CREATE INDEX idx_agent_configs_project_current ON agent_configs(project_id, is_current);
 CREATE INDEX idx_personas_project_approved ON personas(project_id, approved);
 CREATE INDEX idx_scenarios_project_status ON scenarios(project_id, status);
 CREATE INDEX idx_test_runs_project ON test_runs(project_id);
 CREATE INDEX idx_test_results_run ON test_results(test_run_id);
 CREATE INDEX idx_version_history_project ON version_history(project_id, created_at DESC);

 ---
 API Architecture

 Route Structure

 /app/api/
 ├── projects/
 │   ├── route.ts                              # GET all, POST create
 │   └── [id]/
 │       ├── route.ts                          # GET, PATCH, DELETE
 │       ├── config/route.ts                   # GET, PATCH agent config
 │       ├── personas/
 │       │   ├── route.ts                      # GET all, POST create
 │       │   ├── generate/route.ts             # POST - AI generate
 │       │   └── [personaId]/route.ts          # GET, PATCH, DELETE
 │       ├── scenarios/
 │       │   ├── route.ts                      # GET all, POST create
 │       │   ├── generate/route.ts             # POST - AI generate
 │       │   └── [scenarioId]/route.ts         # GET, PATCH, DELETE
 │       ├── scripts/
 │       │   ├── route.ts                      # GET all
 │       │   ├── generate/route.ts             # POST - AI generate
 │       │   └── [scriptId]/route.ts           # GET, PATCH, DELETE
 │       ├── runs/
 │       │   ├── route.ts                      # GET all, POST execute tests
 │       │   └── [runId]/
 │       │       ├── route.ts                  # GET single run
 │       │       └── results/
 │       │           ├── route.ts              # GET all results
 │       │           └── [resultId]/route.ts   # GET single result
 │       └── history/route.ts                  # GET version history
 └── vapi/
     ├── test-eval/route.ts                    # POST - run VAPI test
     ├── assistant/sync/route.ts               # POST - pull from VAPI
     └── assistant/push/route.ts               # POST - push to VAPI

 Response Format

 Success:
 { success: true, data: T, meta?: { page, total } }

 Error:
 { success: false, error: { message: string, code: string, details?: any } }

 ---
 Integration Design

 OpenAI (GPT-4o)

 Usage:
 1. Persona generation - Generate realistic caller profiles
 2. Scenario generation - Create test scenarios from personas
 3. Script generation - Write conversation templates
 4. Evaluation - Score conversations with structured output

 Implementation:
 - /lib/openai/client.ts - OpenAI client wrapper
 - /lib/openai/schemas.ts - Zod schemas for structured outputs
 - /lib/openai/prompts.ts - Prompt templates

 Example Schema (Evaluation):
 export const EvaluationSchema = z.object({
   overallScore: z.number().min(0).max(10),
   summary: z.string(),
   status: z.enum(['Passed', 'Review', 'Failed']),
   flaggedTurns: z.array(z.object({
     turnIndex: z.number(),
     severity: z.enum(['warning', 'error']),
     reason: z.string(),
   })),
   categoryScores: z.object({
     goalAchievement: z.number().min(0).max(10),
     objectionHandling: z.number().min(0).max(10),
     stayedOnScript: z.number().min(0).max(10),
     naturalConversation: z.number().min(0).max(10),
     brandCompliance: z.number().min(0).max(10),
   }),
 })

 VAPI (Text Evaluation API)

 Usage: Run text-based voice agent tests without actual voice calls

 Implementation:
 - /lib/vapi/client.ts - VAPI API wrapper
 - Functions: runVapiTextEval(), syncVapiAssistant(), pushToVapi()

 Flow:
 1. Extract caller turns from test script
 2. Send to VAPI with assistant ID + system prompt
 3. Receive full conversation with agent responses
 4. Store conversation for evaluation

 ---
 TypeScript Types

 Create /types/index.ts with interfaces matching database schema:

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

 // ... similar for Scenario, TestScript, TestRun, TestResult, etc.

 Also generate from Supabase:
 npx supabase gen types typescript --project-id YOUR_ID > types/database.ts

 ---
 Implementation Checklist

 Phase 1: Foundation ✓

 - Install dependencies: pnpm add @supabase/supabase-js openai @tanstack/react-query zod
 - Create Supabase project in dashboard
 - Run database migrations (copy SQL from plan)
 - Create .env.local with keys:
 NEXT_PUBLIC_SUPABASE_URL=...
 NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 SUPABASE_SERVICE_ROLE_KEY=...
 OPENAI_API_KEY=...
 VAPI_API_KEY=...
 - Create /types/index.ts with all interfaces
 - Create /lib/supabase/client.ts (client + admin)
 - Create /lib/api-error.ts (error handling)
 - Create /lib/api/client.ts (frontend API wrapper)

 Phase 2: Projects ✓

 - Create /app/api/projects/route.ts (GET, POST)
 - Create /app/api/projects/[id]/route.ts (GET, PATCH, DELETE)
 - Create /app/api/projects/[id]/config/route.ts (GET, PATCH)
 - Update /app/page.tsx - replace mock data with API calls
 - Update /app/projects/[id]/page.tsx - replace mock data
 - Update /app/projects/[id]/config/page.tsx - connect to API
 - Add React Query provider in root layout
 - Create hooks: useProjects(), useProject(), useCreateProject()

 Phase 3: Test Data ✓

 - Create /lib/openai/client.ts
 - Create /lib/openai/schemas.ts (Zod schemas)
 - Create /lib/openai/prompts.ts (prompt templates)
 - Create /app/api/projects/[id]/personas/route.ts (GET, POST)
 - Create /app/api/projects/[id]/personas/generate/route.ts (AI gen)
 - Create /app/api/projects/[id]/personas/[personaId]/route.ts (PATCH, DELETE)
 - Create /app/api/projects/[id]/scenarios/route.ts (GET, POST)
 - Create /app/api/projects/[id]/scenarios/generate/route.ts (AI gen)
 - Create /app/api/projects/[id]/scenarios/[scenarioId]/route.ts
 - Create /app/api/projects/[id]/scripts/route.ts (GET)
 - Create /app/api/projects/[id]/scripts/generate/route.ts (AI gen)
 - Create /app/api/projects/[id]/scripts/[scriptId]/route.ts
 - Update /app/projects/[id]/personas/page.tsx - connect to API
 - Update /app/projects/[id]/scenarios/page.tsx - connect to API
 - Update /app/projects/[id]/scripts/page.tsx - connect to API
 - Test AI generation: personas → scenarios → scripts

 Phase 4: Test Execution ⭐ CRITICAL

 - Create /lib/vapi/client.ts
 - Test VAPI text eval endpoint manually
 - Create /lib/test-execution/runner.ts (orchestrates test execution)
 - Create /lib/evaluation/evaluator.ts (OpenAI evaluation logic)
 - Create /app/api/projects/[id]/runs/route.ts (GET, POST)
   - POST endpoint should:
       - Create test run record (status: 'running')
     - For each selected script:
           - Call VAPI text eval
       - Call OpenAI evaluation
       - Store test result
     - Update run with avg score (status: 'completed')
     - Update project stats
 - Create /app/api/projects/[id]/runs/[runId]/route.ts (GET)
 - Create /app/api/projects/[id]/runs/[runId]/results/route.ts (GET)
 - Create /app/api/projects/[id]/runs/[runId]/results/[resultId]/route.ts (GET)
 - Update /app/projects/[id]/runs/page.tsx - connect to API
 - Update /app/projects/[id]/runs/[runId]/conversations/[convId]/page.tsx
 - TEST END-TO-END: Create project → generate personas → generate scenarios → generate scripts →
 run tests → view results

 Phase 5: History & Improvements ✓

 - Implement version creation on config changes
 - Create /app/api/projects/[id]/history/route.ts (GET)
 - Update /app/projects/[id]/history/page.tsx - connect to API
 - Create /app/api/projects/[id]/improvements/route.ts (GET, POST)
 - Update /app/projects/[id]/improvements/page.tsx (manual entry for MVP)

 Phase 6: Polish ✓

 - Create /app/api/vapi/assistant/sync/route.ts
 - Create /app/api/vapi/assistant/push/route.ts
 - Connect "Pull from VAPI" button in config page
 - Connect "Push to VAPI" button in config page
 - Update /app/projects/[id]/settings/page.tsx - connect to API
 - Add loading states (Suspense boundaries, skeletons)
 - Add error states (error boundaries, toast notifications)
 - Create database seed script with demo data
 - Test complete flow with fresh database

 ---
 Critical Files to Modify

 Create New Files

 Infrastructure:
 - /lib/supabase/client.ts - Supabase client setup
 - /lib/api-error.ts - Error handling utilities
 - /lib/api/client.ts - Frontend API wrapper
 - /types/index.ts - TypeScript interfaces

 OpenAI:
 - /lib/openai/client.ts - OpenAI client
 - /lib/openai/schemas.ts - Zod schemas
 - /lib/openai/prompts.ts - Prompt templates

 VAPI:
 - /lib/vapi/client.ts - VAPI API wrapper

 Execution:
 - /lib/test-execution/runner.ts - Test orchestration
 - /lib/evaluation/evaluator.ts - Evaluation logic

 API Routes: (28 files total)
 - All routes listed in API Architecture section above

 Hooks:
 - /hooks/use-projects.ts
 - /hooks/use-personas.ts
 - /hooks/use-scenarios.ts
 - /hooks/use-scripts.ts
 - /hooks/use-test-runs.ts

 Modify Existing Files

 Pages (replace mock data with API calls):
 - /app/page.tsx - Dashboard
 - /app/projects/[id]/page.tsx - Project overview
 - /app/projects/[id]/config/page.tsx - Agent config
 - /app/projects/[id]/personas/page.tsx - Personas
 - /app/projects/[id]/scenarios/page.tsx - Scenarios
 - /app/projects/[id]/scripts/page.tsx - Scripts
 - /app/projects/[id]/runs/page.tsx - Test runs ⭐ CRITICAL
 - /app/projects/[id]/runs/[runId]/conversations/[convId]/page.tsx - Conversation detail ⭐
 CRITICAL
 - /app/projects/[id]/improvements/page.tsx - Improvements
 - /app/projects/[id]/history/page.tsx - Version history
 - /app/projects/[id]/settings/page.tsx - Settings

 Root Layout:
 - /app/layout.tsx - Add React Query provider

 Reference (keep for now):
 - /lib/data.ts - Use as reference for seeding database

 ---
 Verification Strategy

 Unit Testing (Manual)

 1. Database Setup:
   - All tables created successfully
   - Foreign keys work correctly
   - Indexes exist
 2. OpenAI Integration:
   - Create test route: /app/api/test/openai/route.ts
   - Persona generation produces valid JSON
   - Scenario generation aligns with persona
   - Script generation creates realistic conversations
   - Evaluation produces consistent scores
 3. VAPI Integration:
   - Create test route: /app/api/test/vapi/route.ts
   - Text eval endpoint responds
   - Response format matches expectations
   - Error handling works

 End-to-End Testing

 Complete User Flow:
 1. Create new project via API
 2. Configure agent (name, type, goal, prompt)
 3. Generate 3 personas via OpenAI
 4. Approve personas
 5. Generate 3 scenarios (one per persona)
 6. Approve scenarios
 7. Generate scripts from scenarios
 8. Approve scripts
 9. Run tests (5 scripts)
 10. View test run results
 11. Click into conversation detail
 12. Verify scores, transcript, flags display correctly
 13. Check version history updates
 14. Update agent config
 15. Run tests again with new version
 16. Verify version comparison works
 17. Push config to VAPI
 18. Pull config from VAPI

 Success Criteria:
 - All pages load without errors
 - All CRUD operations work
 - AI generation produces quality results
 - Test execution completes successfully
 - Scores and evaluations are reasonable
 - Version history tracks changes
 - VAPI sync works both ways

 ---
 Risk Mitigation

 High-Risk Areas

 1. VAPI API Format
   - Risk: Documentation might not match actual API
   - Mitigation: Test early with actual VAPI account
 2. Long Test Execution
   - Risk: Running 20 tests sequentially takes too long
   - Mitigation: Add progress indicator, consider parallel execution in Phase 2
 3. OpenAI Consistency
   - Risk: Evaluation scores might be inconsistent
   - Mitigation: Detailed prompts, structured outputs, test with multiple runs
 4. Database Performance
   - Risk: JSONB columns might be slow at scale
   - Mitigation: Indexes on common queries, pagination on list endpoints

 Fallback Plans

 - VAPI unavailable: Mock responses for development
 - OpenAI rate limits: Add retry logic with exponential backoff
 - Supabase issues: Local Postgres for development

 ---
 Post-MVP Enhancements

 Not in current scope, but consider for future:
 1. Multi-user authentication (Supabase Auth)
 2. Auto-generate improvement suggestions from patterns
 3. Cost tracking dashboard
 4. Parallel test execution
 5. Real-time test progress updates
 6. Export test results
 7. A/B testing (compare prompt versions)
 8. Team collaboration features

 ---
 Environment Setup

 Required environment variables:

 # Supabase
 NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
 NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
 SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

 # OpenAI
 OPENAI_API_KEY=sk-proj-...

 # VAPI
 VAPI_API_KEY=your-vapi-key

 # App
 NEXT_PUBLIC_APP_URL=http://localhost:3000

 ---
 Dependencies to Install

 pnpm add @supabase/supabase-js openai @tanstack/react-query zod

 Already installed (from v0):
 - Next.js 16, React 19, TypeScript
 - shadcn/ui components
 - react-hook-form, zod
 - Tailwind CSS, lucide-react
 - sonner (toasts)

 ---
 Success Metrics

 MVP is complete when:
 - ✅ All database tables exist and work
 - ✅ Projects can be created and configured
 - ✅ AI generates realistic personas, scenarios, scripts
 - ✅ Tests execute via VAPI text API
 - ✅ OpenAI evaluates conversations with scores
 - ✅ Results display correctly with transcripts
 - ✅ Version history tracks iterations
 - ✅ VAPI sync (push/pull) works
 - ✅ End-to-end flow completes without errors
 - ✅ Loading states and error handling work

 Ready to validate with users when this checklist is complete.