# AgentForge — V0 Frontend Prompt

## Overview

Build a full frontend demo for a product called **AgentForge** — an AI-powered voice agent testing and iteration platform for developers building on VAPI. The app helps developers systematically test and improve the intelligence of their voice agents through AI-generated test scenarios, automated text-based test runs, scored evaluations, and iterative improvement suggestions — all with human approval at every step.

This is a **demo with fake pre-loaded data**. There is no backend. All data is hardcoded/mocked. The goal is to showcase the full product to potential users for waitlist signups.

---

## Tech & Style

- **Framework**: Next.js with App Router
- **Components**: shadcn/ui throughout
- **Styling**: Tailwind CSS
- **Theme**: Dark mode by default, with a light mode toggle in the top right. Dark theme should feel like a premium developer tool — deep grays/blacks, subtle borders, accent color in indigo or violet.
- **Typography**: Clean, modern — Inter or similar
- **No authentication screens needed** — app opens directly to the dashboard

---

## Global Layout

- **Left sidebar** (fixed, collapsible) for navigation
- **Main content area** to the right
- **Top bar** with: product logo "AgentForge" on the top left of sidebar, light/dark mode toggle top right, and a fake user avatar/menu top right
- Sidebar has two states:
  - **Top level**: shows "Projects" only with a list of projects
  - **Inside a project**: shows the project name at the top of the sidebar with back arrow to projects, then project-specific nav items listed vertically in workflow order

---

## Pages & Views

---

### 1. Projects Dashboard (`/`)

The home screen. Shows a grid of project cards.

**Pre-loaded projects (2):**

**Project 1: TechRecruit AI**
- Tag: Recruiting
- VAPI Assistant connected
- Current version: v4
- Latest average score: 7.8 / 10
- Last tested: 2 days ago
- Tests run: 124
- Status badge: "Active"

**Project 2: InsureBot Pro**
- Tag: Insurance Sales
- VAPI Assistant connected
- Current version: v2
- Latest average score: 5.4 / 10
- Last tested: 5 days ago
- Tests run: 38
- Status badge: "Needs Attention" (amber)

Each card shows all the above info, a mini sparkline score trend chart, and a "Open Project" button.

Top right of the page: a "+ New Project" button (non-functional, just UI).

---

### 2. Project Overview (`/projects/[id]`)

The cockpit for a single project. Use **TechRecruit AI** as the default open project.

**Top section**: Project name, tag badge, VAPI assistant ID shown as a monospace string, current version badge (v4), and a "Push to VAPI" button (non-functional).

**4 stat cards in a row:**
- Current Avg Score: 7.8 / 10
- Total Tests Run: 124
- Open Issues: 3
- Iterations Completed: 4

**Score Trend Chart**: A line chart showing score improvement across 4 iterations:
- v1: 4.2
- v2: 5.9
- v3: 6.7
- v4: 7.8
Label it "Average Score per Iteration". Use a smooth line with dots at each version. Indigo/violet color.

**Recent Test Run summary**: A small table showing the last 5 test runs with name, score, and status (Passed / Review Needed).

**Quick nav cards** at the bottom: clickable cards for Personas, Scenarios, Test Scripts, Test Runs, Improvements — each with an icon, title, and a short description of what it does.

---

### 3. Agent Configuration (`/projects/[id]/config`)

Split into two columns.

**Left column — Agent Details:**
- Field: Agent Name → "TechRecruit AI"
- Field: Agent Type → "Technical Recruiter"
- Field: Primary Goal → "Qualify candidates for software engineering roles, gather experience details, and schedule a follow-up interview"
- Field: Tone & Personality → "Professional, warm, and encouraging. Sounds like a senior HR professional."
- Field: Must Never Do → multiline text → "Never make promises about salary. Never confirm a candidate is selected. Never discuss competitor companies."
- Field: VAPI Assistant ID → monospace input → "asst_xK9mP2qR7vL4nW"
- "Save Changes" button and "Pull latest from VAPI" button

**Right column — Current System Prompt:**
- Large read-only code/text block showing a realistic system prompt for a tech recruiter AI. About 15-20 lines of realistic prompt text.
- "Edit Prompt" button that makes it editable
- Version tag showing "v4 — last updated 3 days ago"

---

### 4. Personas (`/projects/[id]/personas`)

**Page header**: "Caller Personas" with a subtitle "Define who your agent will be tested against" and an "AI Suggest Personas" button (shows a loading shimmer when clicked, then adds a new pending persona — fake interaction).

**Personas list** — show 6 personas in a card grid (2 or 3 columns):

1. **Sarah Chen** — Enthusiastic junior dev, 2 years exp, excited about the role. Difficulty: Easy. Tag: "Happy Path"
2. **Marcus Williams** — Senior engineer, skeptical, busy, lots of objections about the process. Difficulty: Hard. Tag: "Skeptical"
3. **Priya Patel** — Non-native English speaker, sometimes misunderstands questions, needs clarification. Difficulty: Medium. Tag: "Communication Gap"
4. **Jake Thompson** — Aggressive, impatient, pushes back on every question. Difficulty: Hard. Tag: "Hostile"
5. **Linda Okafor** — Career changer, nervous, unsure if she qualifies, needs reassurance. Difficulty: Medium. Tag: "Uncertain"
6. **David Kim** — Very technical, gives one-word answers, hard to engage. Difficulty: Medium. Tag: "Low Engagement"

Each card shows: name, short description, difficulty badge (color-coded: green/easy, amber/medium, red/hard), tag badge, and an "Approved" green checkmark badge. Actions: Edit, Delete.

One persona at the bottom in a "Pending Approval" state (slightly dimmed, with "Approve" and "Dismiss" buttons) — this represents an AI suggestion waiting for review.

---

### 5. Scenarios (`/projects/[id]/scenarios`)

**Page header**: "Test Scenarios" with "AI Suggest Scenarios" button.

Show a table or card list of 8 scenarios. Each has:
- Scenario name
- Persona assigned (linked)
- Difficulty
- Goal of the call
- Expected outcome
- Status: Approved / Pending

**Sample scenarios:**

1. "Standard Qualification Call" — Sarah Chen — Easy — Qualify candidate smoothly — Full qualification completed — Approved
2. "Senior Dev With Objections" — Marcus Williams — Hard — Handle objections about process length — Candidate agrees to next step despite hesitation — Approved
3. "Language Barrier Qualification" — Priya Patel — Medium — Complete qualification despite communication gaps — Key info gathered with patience — Approved
4. "Hostile Candidate Management" — Jake Thompson — Hard — De-escalate and keep call productive — Candidate stays on call and answers core questions — Approved
5. "Career Changer Reassurance" — Linda Okafor — Medium — Qualify and reassure — Candidate feels confident and agrees to next step — Approved
6. "Low Engagement Candidate" — David Kim — Medium — Draw out information from reluctant speaker — Sufficient info gathered — Approved
7. "Candidate Asks Off-Script Questions" — Marcus Williams — Hard — Handle unexpected questions gracefully — Agent stays on track — Approved
8. "Candidate Tests Agent's Knowledge Limits" — David Kim — Hard — Handle questions agent can't answer — Pending Approval (dimmed)

---

### 6. Test Scripts (`/projects/[id]/scripts`)

Show a list of generated test scripts. Each row in a table shows: script name, scenario it's based on, persona, number of turns, status (Approved/Pending), and a "View Script" button.

Clicking "View Script" opens a right-side drawer or modal showing the full back-and-forth conversation script — alternating lines of "Caller:" and "Agent:" in a chat-bubble style. Show a realistic 10-12 turn script for "Senior Dev With Objections" as the example open state.

Show 6 approved scripts and 1 pending script in the table.

---

### 7. Test Runs (`/projects/[id]/runs`)

**Page header**: "Test Runs" with a "Run Tests" button (opens a modal to select which scripts to run and how many times).

**Active/Latest Run summary banner** at top: "Run #12 — Completed 2 hours ago — 20 tests — Avg score: 7.8 — 3 flagged for review"

**Runs history table** showing last 5 runs:
- Run #12 — 20 tests — Avg 7.8 — 3 flagged — 2 hours ago
- Run #11 — 15 tests — Avg 7.4 — 5 flagged — 4 days ago
- Run #10 — 10 tests — Avg 6.7 — 6 flagged — 8 days ago
- Run #9 — 20 tests — Avg 5.9 — 9 flagged — 12 days ago
- Run #8 — 10 tests — Avg 5.2 — 8 flagged — 16 days ago

**Below**: Results table for Run #12 showing all 20 test results:

Each row: Script name | Persona | Score (colored: green 8-10, amber 6-7, red <6) | One-line AI summary | Status badge | "View Transcript" button

Sample rows:
- Standard Qualification Call — Sarah Chen — 9.2 — "Smooth qualification, all goals met" — Passed
- Senior Dev With Objections — Marcus Williams — 6.1 — "Handled objections but lost control in turn 7" — Review
- Language Barrier — Priya Patel — 7.4 — "Good patience, missed one key question" — Review
- Hostile Candidate — Jake Thompson — 5.8 — "De-escalation failed at turn 4, candidate disengaged" — Review
- Career Changer — Linda Okafor — 8.9 — "Excellent reassurance, natural flow" — Passed
- Low Engagement — David Kim — 7.1 — "Gathered key info but conversation felt forced" — Passed
(fill remaining 14 rows with varied scores between 6.5–9.5 for the other personas/scenarios, mostly Passed)

---

### 8. Conversation Detail (`/projects/[id]/runs/[runId]/conversations/[convId]`)

This is the most important view. Accessible by clicking "View Transcript" from the Test Runs page.

**Layout — 3 columns:**

**Left (narrow)**: Test metadata
- Script name
- Persona: Marcus Williams (with his description)
- Run: #12
- Date/time
- Overall Score: 6.1 / 10

Score breakdown cards (small):
- Goal Achievement: 5/10
- Objection Handling: 6/10
- Stayed On Script: 8/10
- Natural Conversation: 7/10
- Brand Compliance: 9/10

**Middle (wide)**: Full conversation transcript in chat-bubble style
- "Caller" bubbles on the left (gray)
- "Agent" bubbles on the right (indigo tinted)
- Show a realistic 14-turn conversation for Marcus Williams (senior dev, skeptical)
- At turn 7, highlight the agent's bubble in amber with a small warning icon — this is where the AI flagged an issue
- At turn 11, highlight another agent bubble in red — more serious issue

**Right (narrow)**: AI Analysis panel
- Section: "What went wrong"
  - Issue 1 (Turn 7): "Agent became defensive when candidate questioned the interview process length. Should have acknowledged the concern and pivoted." — Severity: Medium
  - Issue 2 (Turn 11): "Agent failed to re-engage after candidate said 'I'm not interested.' No recovery attempt was made." — Severity: High
- Section: "Suggested Fix"
  - "Add handling for process objections: acknowledge timeline concern, explain value of each step"
  - "Add recovery script for disengagement signals: 'I understand, can I ask what your main concern is?'"
- "Send to Improvements" button for each suggestion
- "Add Manual Note" text area for human reviewer

---

### 9. Improvement Suggestions (`/projects/[id]/improvements`)

**Page header**: "Improvement Suggestions" with subtitle "AI-identified patterns from the latest test run. Review and approve changes before they're applied."

**Stats row**: 5 open suggestions | 3 approved this week | 2 dismissed

Show suggestions as cards. Each card has:
- Issue title
- How many tests it appeared in (e.g. "Found in 6 of 20 tests")
- Affected area badge: Prompt / Knowledge Base / Conversation Flow
- Description of the problem
- Suggested change (shown as a before/after diff style — old prompt section struck through in red, new in green)
- Approve / Edit / Dismiss buttons
- Severity badge: High / Medium / Low

**5 suggestion cards:**

1. **"Recovery from disengagement"** — Found in 6/20 tests — Conversation Flow — High
   - Problem: "Agent has no recovery mechanism when candidate signals disengagement"
   - Fix: Add 2 recovery lines to prompt

2. **"Process length objection handling"** — Found in 4/20 tests — Prompt — Medium
   - Problem: "Agent becomes defensive about interview process length instead of reframing value"
   - Fix: Specific language addition to prompt

3. **"Clarification for non-native speakers"** — Found in 3/20 tests — Conversation Flow — Medium
   - Problem: "Agent doesn't offer to rephrase when candidate asks for clarification twice"
   - Fix: Add clarification trigger to conversation flow

4. **"Salary question deflection"** — Found in 2/20 tests — Prompt — Low
   - Problem: "Agent deflects salary questions correctly but sounds robotic"
   - Fix: Softer language for salary deflection

5. **"Opening hook engagement"** — Found in 5/20 tests — Prompt — Medium
   - Problem: "Opening 2 turns feel scripted and candidates disengage early"
   - Fix: More natural opening language

Cards 1 and 2 are shown as "Approved" (green badge, greyed out slightly). Cards 3-5 are pending.

---

### 10. Version History (`/projects/[id]/history`)

**Page header**: "Version History"

**Score trend chart** at top — same as on Overview but larger, showing all 4 versions with score annotations.

**Timeline below** — vertical timeline, one entry per version:

**v4** — Current — 3 days ago
- Avg score: 7.8
- Changes applied: 3 improvements from Run #10
- "Recovery from disengagement added", "Process objection handling improved", "Opening hook revised"
- Tests run on this version: 40

**v3** — 10 days ago
- Avg score: 6.7
- Changes applied: 2 improvements from Run #8
- Tests run: 30

**v2** — 18 days ago
- Avg score: 5.9
- Changes applied: 4 improvements from Run #5
- Tests run: 30

**v1** — 26 days ago
- Avg score: 4.2
- Initial version
- Tests run: 24

Each version entry has a "View Prompt" button that opens a modal showing the system prompt for that version. And a "Compare with current" button.

---

### 11. Settings (`/projects/[id]/settings`)

Simple settings page with:
- VAPI API Key field (masked, with show/hide toggle)
- Notification preferences (email on run complete — toggle)
- Danger zone: Delete project (red, with confirmation)

Also a top-level account settings accessible from the user avatar dropdown with just name/email fields.

---

## Demo-Specific Details

- All buttons that would trigger real actions (Run Tests, Push to VAPI, AI Suggest, etc.) should show a toast notification saying something like "This is a demo — sign up to use the real thing" OR show a fake loading state followed by a simulated result. Prefer the fake loading state where it adds visual excitement (e.g. AI Suggest Personas shows a shimmer then adds a new pending persona card).
- The "Join Waitlist" CTA should appear as a subtle banner at the very top of the app (above the sidebar/content) saying something like "AgentForge is coming soon — join the waitlist to get early access" with an email input and submit button.
- Navigation between all pages should work via Next.js routing — no dead links.
- All charts use recharts or a shadcn-compatible chart library.
- Responsive enough to look good on a 1280px+ screen. Mobile not a priority.

---

## Tone & Copy

The product is for developers. Keep UI copy sharp and direct. No fluff. Labels like "Caller Personas" not "Meet Your Test Users". Error states and empty states should be helpful and technical. Think Linear, Vercel, Railway — not Notion or Canva.

---

## What Success Looks Like

A developer landing on this demo should within 2 minutes understand: what AgentForge does, how the workflow flows from setup to iteration, and feel like "this would save me a lot of time." The Conversation Detail view and the Improvement Suggestions view are the hero screens — make them impressive.