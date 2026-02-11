export const projects = [
  {
    id: "techrecruit-ai",
    name: "TechRecruit AI",
    tag: "Recruiting",
    vapiAssistantId: "asst_xK9mP2qR7vL4nW",
    currentVersion: "v4",
    latestAvgScore: 7.8,
    lastTested: "2 days ago",
    testsRun: 124,
    status: "Active" as const,
    scoreTrend: [4.2, 5.9, 6.7, 7.8],
    openIssues: 3,
    iterationsCompleted: 4,
  },
  {
    id: "insurebot-pro",
    name: "InsureBot Pro",
    tag: "Insurance Sales",
    vapiAssistantId: "asst_jR3nL8qW2xM9pT",
    currentVersion: "v2",
    latestAvgScore: 5.4,
    lastTested: "5 days ago",
    testsRun: 38,
    status: "Needs Attention" as const,
    scoreTrend: [3.1, 5.4],
    openIssues: 7,
    iterationsCompleted: 2,
  },
]

export const personas = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    description: "Enthusiastic junior dev, 2 years exp, excited about the role.",
    difficulty: "Easy" as const,
    tag: "Happy Path",
    approved: true,
  },
  {
    id: "marcus-williams",
    name: "Marcus Williams",
    description: "Senior engineer, skeptical, busy, lots of objections about the process.",
    difficulty: "Hard" as const,
    tag: "Skeptical",
    approved: true,
  },
  {
    id: "priya-patel",
    name: "Priya Patel",
    description: "Non-native English speaker, sometimes misunderstands questions, needs clarification.",
    difficulty: "Medium" as const,
    tag: "Communication Gap",
    approved: true,
  },
  {
    id: "jake-thompson",
    name: "Jake Thompson",
    description: "Aggressive, impatient, pushes back on every question.",
    difficulty: "Hard" as const,
    tag: "Hostile",
    approved: true,
  },
  {
    id: "linda-okafor",
    name: "Linda Okafor",
    description: "Career changer, nervous, unsure if she qualifies, needs reassurance.",
    difficulty: "Medium" as const,
    tag: "Uncertain",
    approved: true,
  },
  {
    id: "david-kim",
    name: "David Kim",
    description: "Very technical, gives one-word answers, hard to engage.",
    difficulty: "Medium" as const,
    tag: "Low Engagement",
    approved: true,
  },
]

export const pendingPersona = {
  id: "alex-rivera",
  name: "Alex Rivera",
  description: "Mid-level developer who keeps going off on tangents about their side projects and is hard to redirect.",
  difficulty: "Medium" as const,
  tag: "Off-topic",
  approved: false,
}

export const scenarios = [
  { id: "s1", name: "Standard Qualification Call", personaId: "sarah-chen", personaName: "Sarah Chen", difficulty: "Easy" as const, goal: "Qualify candidate smoothly", expectedOutcome: "Full qualification completed", status: "Approved" as const },
  { id: "s2", name: "Senior Dev With Objections", personaId: "marcus-williams", personaName: "Marcus Williams", difficulty: "Hard" as const, goal: "Handle objections about process length", expectedOutcome: "Candidate agrees to next step despite hesitation", status: "Approved" as const },
  { id: "s3", name: "Language Barrier Qualification", personaId: "priya-patel", personaName: "Priya Patel", difficulty: "Medium" as const, goal: "Complete qualification despite communication gaps", expectedOutcome: "Key info gathered with patience", status: "Approved" as const },
  { id: "s4", name: "Hostile Candidate Management", personaId: "jake-thompson", personaName: "Jake Thompson", difficulty: "Hard" as const, goal: "De-escalate and keep call productive", expectedOutcome: "Candidate stays on call and answers core questions", status: "Approved" as const },
  { id: "s5", name: "Career Changer Reassurance", personaId: "linda-okafor", personaName: "Linda Okafor", difficulty: "Medium" as const, goal: "Qualify and reassure", expectedOutcome: "Candidate feels confident and agrees to next step", status: "Approved" as const },
  { id: "s6", name: "Low Engagement Candidate", personaId: "david-kim", personaName: "David Kim", difficulty: "Medium" as const, goal: "Draw out information from reluctant speaker", expectedOutcome: "Sufficient info gathered", status: "Approved" as const },
  { id: "s7", name: "Candidate Asks Off-Script Questions", personaId: "marcus-williams", personaName: "Marcus Williams", difficulty: "Hard" as const, goal: "Handle unexpected questions gracefully", expectedOutcome: "Agent stays on track", status: "Approved" as const },
  { id: "s8", name: "Candidate Tests Agent's Knowledge Limits", personaId: "david-kim", personaName: "David Kim", difficulty: "Hard" as const, goal: "Handle questions agent can't answer", expectedOutcome: "Graceful deflection with follow-up promise", status: "Pending" as const },
]

export const testScripts = [
  { id: "ts1", name: "Standard Qual - Happy Path", scenarioId: "s1", scenarioName: "Standard Qualification Call", personaName: "Sarah Chen", turns: 10, status: "Approved" as const },
  { id: "ts2", name: "Senior Dev Objections - Full", scenarioId: "s2", scenarioName: "Senior Dev With Objections", personaName: "Marcus Williams", turns: 14, status: "Approved" as const },
  { id: "ts3", name: "Language Barrier - Clarifications", scenarioId: "s3", scenarioName: "Language Barrier Qualification", personaName: "Priya Patel", turns: 12, status: "Approved" as const },
  { id: "ts4", name: "Hostile Candidate - De-escalation", scenarioId: "s4", scenarioName: "Hostile Candidate Management", personaName: "Jake Thompson", turns: 11, status: "Approved" as const },
  { id: "ts5", name: "Career Changer - Reassurance Flow", scenarioId: "s5", scenarioName: "Career Changer Reassurance", personaName: "Linda Okafor", turns: 10, status: "Approved" as const },
  { id: "ts6", name: "Low Engagement - Extraction", scenarioId: "s6", scenarioName: "Low Engagement Candidate", personaName: "David Kim", turns: 12, status: "Approved" as const },
  { id: "ts7", name: "Off-Script Questions - Handling", scenarioId: "s7", scenarioName: "Candidate Asks Off-Script Questions", personaName: "Marcus Williams", turns: 13, status: "Pending" as const },
]

export const seniorDevScript = [
  { role: "agent" as const, text: "Hi Marcus, thanks for taking the time to speak with me today. I'm an AI recruiter assistant for TechCorp. I'd love to learn a bit about your background and see if there's a fit for our senior engineering positions. How are you doing today?" },
  { role: "caller" as const, text: "Fine. Look, I'm really busy, so can we keep this short? I'm not even sure why I agreed to this call." },
  { role: "agent" as const, text: "Absolutely, I respect your time. I'll keep this focused. Could you start by telling me briefly about your current role and what technologies you work with?" },
  { role: "caller" as const, text: "I'm a staff engineer at a Series B startup. Mostly Go and Rust on the backend, React on the frontend. We handle about 2 million requests per second. What exactly is this role?" },
  { role: "agent" as const, text: "Great background. The role is a Senior Software Engineer position focused on distributed systems. Your experience with high-throughput systems sounds very relevant. Can I ask how many years you've been working in software engineering?" },
  { role: "caller" as const, text: "12 years. But honestly, your interview process seems really long. I looked it up — 5 rounds? That's ridiculous for a senior hire." },
  { role: "agent" as const, text: "I understand the process might seem extensive. Each round is designed to evaluate different aspects and we find it gives candidates the best opportunity to showcase their skills. Let me note your concern about the timeline.", flagged: "warning" as const, flagReason: "Agent became defensive when candidate questioned the interview process length. Should have acknowledged the concern and pivoted to the value of each step." },
  { role: "caller" as const, text: "That's not really an answer. I've been doing this for 12 years — you can tell from my GitHub and my track record whether I can code. Why do I need 5 rounds?" },
  { role: "agent" as const, text: "That's a fair point, Marcus. Your experience does speak volumes. Let me continue gathering a few more details — what's your experience with team leadership and mentoring?" },
  { role: "caller" as const, text: "I lead a team of 8. I've mentored probably 15 junior devs over my career. But I'm starting to think this isn't worth my time." },
  { role: "agent" as const, text: "I see. Well, if you're not interested, I understand. We do have many qualified candidates in the pipeline.", flagged: "error" as const, flagReason: "Agent failed to re-engage after candidate said they're losing interest. No recovery attempt was made. Should have acknowledged concern and asked about main hesitation." },
  { role: "caller" as const, text: "That's... not exactly what I said. I said the process seems long. Whatever, what are the next steps?" },
  { role: "agent" as const, text: "The next step would be a technical screening call with one of our engineering managers. It's a 45-minute conversation focused on system design — very relevant to your distributed systems background. Can I schedule that?" },
  { role: "caller" as const, text: "Fine. Send me some times. But if the first round isn't impressive, I'm out." },
]

export const testRuns = [
  { id: "run-12", number: 12, totalTests: 20, avgScore: 7.8, flagged: 3, completedAt: "2 hours ago" },
  { id: "run-11", number: 11, totalTests: 15, avgScore: 7.4, flagged: 5, completedAt: "4 days ago" },
  { id: "run-10", number: 10, totalTests: 10, avgScore: 6.7, flagged: 6, completedAt: "8 days ago" },
  { id: "run-9", number: 9, totalTests: 20, avgScore: 5.9, flagged: 9, completedAt: "12 days ago" },
  { id: "run-8", number: 8, totalTests: 10, avgScore: 5.2, flagged: 8, completedAt: "16 days ago" },
]

export const run12Results = [
  { id: "r1", scriptName: "Standard Qualification Call", persona: "Sarah Chen", score: 9.2, summary: "Smooth qualification, all goals met", status: "Passed" as const },
  { id: "r2", scriptName: "Senior Dev With Objections", persona: "Marcus Williams", score: 6.1, summary: "Handled objections but lost control in turn 7", status: "Review" as const },
  { id: "r3", scriptName: "Language Barrier Qualification", persona: "Priya Patel", score: 7.4, summary: "Good patience, missed one key question", status: "Review" as const },
  { id: "r4", scriptName: "Hostile Candidate Management", persona: "Jake Thompson", score: 5.8, summary: "De-escalation failed at turn 4, candidate disengaged", status: "Review" as const },
  { id: "r5", scriptName: "Career Changer Reassurance", persona: "Linda Okafor", score: 8.9, summary: "Excellent reassurance, natural flow", status: "Passed" as const },
  { id: "r6", scriptName: "Low Engagement Candidate", persona: "David Kim", score: 7.1, summary: "Gathered key info but conversation felt forced", status: "Passed" as const },
  { id: "r7", scriptName: "Standard Qual - Variant B", persona: "Sarah Chen", score: 9.5, summary: "Perfect execution, excellent rapport building", status: "Passed" as const },
  { id: "r8", scriptName: "Objection Handling - Variant B", persona: "Marcus Williams", score: 7.2, summary: "Better recovery but still hesitant on process Q", status: "Passed" as const },
  { id: "r9", scriptName: "Clarification Flow", persona: "Priya Patel", score: 8.1, summary: "Rephrased effectively, all info captured", status: "Passed" as const },
  { id: "r10", scriptName: "De-escalation Variant", persona: "Jake Thompson", score: 6.8, summary: "Maintained composure, partial goal achievement", status: "Passed" as const },
  { id: "r11", scriptName: "Career Changer - Extended", persona: "Linda Okafor", score: 8.5, summary: "Strong reassurance with good next-step clarity", status: "Passed" as const },
  { id: "r12", scriptName: "Low Engagement - Probing", persona: "David Kim", score: 7.8, summary: "Better probing questions, engagement improved", status: "Passed" as const },
  { id: "r13", scriptName: "Off-Script Questions", persona: "Marcus Williams", score: 7.0, summary: "Handled most questions, one weak redirect", status: "Passed" as const },
  { id: "r14", scriptName: "Knowledge Limits Test", persona: "David Kim", score: 8.3, summary: "Clean deflection with promise to follow up", status: "Passed" as const },
  { id: "r15", scriptName: "Rapid-Fire Qualification", persona: "Sarah Chen", score: 9.0, summary: "Efficient and natural, great pacing", status: "Passed" as const },
  { id: "r16", scriptName: "Multi-Objection Scenario", persona: "Marcus Williams", score: 6.5, summary: "Handled 2 of 3 objections well, stumbled on salary", status: "Passed" as const },
  { id: "r17", scriptName: "Emotional Support Flow", persona: "Linda Okafor", score: 8.7, summary: "Empathetic responses, candidate felt heard", status: "Passed" as const },
  { id: "r18", scriptName: "Technical Deep Dive", persona: "David Kim", score: 7.9, summary: "Good technical engagement, drew out details", status: "Passed" as const },
  { id: "r19", scriptName: "Time Pressure Scenario", persona: "Jake Thompson", score: 6.9, summary: "Managed time pressure, kept candidate engaged", status: "Passed" as const },
  { id: "r20", scriptName: "Full Pipeline Test", persona: "Sarah Chen", score: 9.1, summary: "Complete pipeline execution, seamless transitions", status: "Passed" as const },
]

export const improvements = [
  {
    id: "imp1",
    title: "Recovery from disengagement",
    appearedIn: "6 of 20",
    area: "Conversation Flow" as const,
    severity: "High" as const,
    problem: "Agent has no recovery mechanism when candidate signals disengagement or loss of interest during the call.",
    oldText: "// No recovery handling exists in current prompt",
    newText: 'If the candidate signals disengagement (e.g. "not worth my time", "I\'m losing interest"), respond with empathy: "I completely understand your concern. Can I ask what\'s your main hesitation? I want to make sure this is worth your time."',
    status: "Approved" as const,
  },
  {
    id: "imp2",
    title: "Process length objection handling",
    appearedIn: "4 of 20",
    area: "Prompt" as const,
    severity: "Medium" as const,
    problem: "Agent becomes defensive about interview process length instead of reframing the value proposition.",
    oldText: "Handle candidate questions about the interview process professionally.",
    newText: 'When candidates question process length, acknowledge their concern first: "That\'s a great question — we\'ve designed each round to give you the best opportunity to demonstrate different strengths." Then pivot to their specific interests.',
    status: "Approved" as const,
  },
  {
    id: "imp3",
    title: "Clarification for non-native speakers",
    appearedIn: "3 of 20",
    area: "Conversation Flow" as const,
    severity: "Medium" as const,
    problem: "Agent doesn't offer to rephrase when candidate asks for clarification twice in a row.",
    oldText: "Repeat the question if the candidate asks for clarification.",
    newText: 'If a candidate asks for clarification more than once, proactively offer: "Let me rephrase that in a different way..." and use simpler language. Track clarification requests and adjust complexity accordingly.',
    status: "Pending" as const,
  },
  {
    id: "imp4",
    title: "Salary question deflection",
    appearedIn: "2 of 20",
    area: "Prompt" as const,
    severity: "Low" as const,
    problem: "Agent deflects salary questions correctly but sounds robotic and impersonal.",
    oldText: "I'm not able to discuss salary details at this stage of the process.",
    newText: "Great question — compensation is definitely an important factor. While I don't have the specific numbers for this role, I can tell you our packages are competitive. The hiring manager would be the best person to discuss this in detail during your next conversation.",
    status: "Pending" as const,
  },
  {
    id: "imp5",
    title: "Opening hook engagement",
    appearedIn: "5 of 20",
    area: "Prompt" as const,
    severity: "Medium" as const,
    problem: "Opening 2 turns feel scripted and candidates disengage early due to formulaic introduction.",
    oldText: "Hi [name], thanks for taking the time to speak with me today. I'm an AI recruiter assistant. I'd love to learn about your background.",
    newText: "Hi [name]! I've been looking at your profile and I'm genuinely impressed by your work on [specific detail]. I'd love to hear more about that and see if we might have something exciting for you.",
    status: "Pending" as const,
  },
]

export const versionHistory = [
  {
    version: "v4",
    label: "Current",
    date: "3 days ago",
    avgScore: 7.8,
    changes: ["Recovery from disengagement added", "Process objection handling improved", "Opening hook revised"],
    testsRun: 40,
    fromRun: "#10",
    improvementsApplied: 3,
  },
  {
    version: "v3",
    label: "",
    date: "10 days ago",
    avgScore: 6.7,
    changes: ["Clarification triggers added", "Tone adjustments for hostile scenarios"],
    testsRun: 30,
    fromRun: "#8",
    improvementsApplied: 2,
  },
  {
    version: "v2",
    label: "",
    date: "18 days ago",
    avgScore: 5.9,
    changes: ["Salary deflection softened", "Opening script revised", "Added reassurance patterns", "Low engagement probing added"],
    testsRun: 30,
    fromRun: "#5",
    improvementsApplied: 4,
  },
  {
    version: "v1",
    label: "Initial",
    date: "26 days ago",
    avgScore: 4.2,
    changes: ["Initial version"],
    testsRun: 24,
    fromRun: "",
    improvementsApplied: 0,
  },
]

export const systemPrompt = `You are TechRecruit AI, an AI-powered technical recruiter assistant for TechCorp.

ROLE: You conduct initial qualification calls with software engineering candidates.

GOALS:
- Gather key information: years of experience, tech stack, team leadership
- Assess cultural fit and communication skills
- Determine if candidate meets minimum qualifications
- Schedule follow-up interviews with hiring managers

TONE: Professional, warm, and encouraging. Sound like a senior HR professional
who genuinely cares about finding the right fit for both the candidate and the company.

CONVERSATION FLOW:
1. Greet candidate warmly, reference something specific from their profile
2. Ask about current role and responsibilities (2-3 questions)
3. Explore technical experience and stack preferences
4. Discuss team collaboration and leadership experience
5. Address any questions the candidate has
6. If qualified, propose next steps. If not, provide constructive feedback.

MUST NEVER:
- Make promises about salary or compensation ranges
- Confirm a candidate is selected or guaranteed to advance
- Discuss competitor companies or make comparisons
- Share internal hiring metrics or pipeline information
- Rush the candidate or show impatience

RECOVERY PROTOCOLS:
- If candidate shows disengagement, acknowledge and ask about concerns
- If candidate is hostile, remain calm and redirect professionally
- If communication barrier exists, rephrase and confirm understanding`

export const recentTests = [
  { name: "Standard Qualification Call", score: 9.2, status: "Passed" as const },
  { name: "Senior Dev With Objections", score: 6.1, status: "Review" as const },
  { name: "Language Barrier Qual.", score: 7.4, status: "Review" as const },
  { name: "Career Changer Reassurance", score: 8.9, status: "Passed" as const },
  { name: "Hostile Candidate Mgmt.", score: 5.8, status: "Review" as const },
]

export const scoreAnalysis = {
  goalAchievement: 5,
  objectionHandling: 6,
  stayedOnScript: 8,
  naturalConversation: 7,
  brandCompliance: 9,
}
