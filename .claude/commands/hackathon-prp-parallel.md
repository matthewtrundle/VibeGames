---
command: hackathon-prp-parallel
description: Generate and execute a hackathon MVP using parallel agents with Archon integration (Next.js + Supabase optimized)
arguments:
  - name: challenge
    description: Path to INITIAL.md or brief description of the hackathon challenge
---

# Hackathon PRP Parallel Workflow - MVP Speed Edition

Execute a streamlined parallel workflow leveraging 10 AI agents + Archon MCP to deliver a working MVP in 25 minutes.

## Overview

**Optimized for:** Next.js 14+ (App Router) + Supabase + OpenRouter
**Total Time:** ~25 minutes (down from 40)
**Agents:** 10 parallel agents (down from 25)
**Focus:** MVP functionality over perfect code

This workflow deploys:
- 1 Archon setup (project + task management)
- 4 agents for spec generation (Tech, UX, Business, Demo)
- 2 agents for implementation planning (Backend, Frontend)
- 3 agents for backend implementation (Next.js API + Supabase)
- 2 agents for frontend implementation (Next.js UI)
- 1 agent for integration

## Phase 0: Archon Project Initialization (1 minute)

**BEFORE starting agents, create Archon project for tracking:**

```
Use mcp__archon__manage_project to create project:

Action: "create"
Title: "Hackathon MVP: {{challenge}}"
Description: "Rapid hackathon implementation using 10 parallel agents. Tech stack: Next.js + Supabase + OpenRouter"
GitHub Repo: (leave empty for now)

CRITICAL: Store the returned project_id - you'll need it for task creation!
```

## Step 1: Parallel Spec Generation (5 minutes)

Deploy 4 parallel agents to analyze the challenge (removed Testing Strategy for MVP speed):

```
Use the Task tool to run these 4 research agents in PARALLEL for challenge: $ARGUMENTS

IMPORTANT: Read the full INITIAL.md file to understand:
- FEATURE: What to build
- TECH STACK: Next.js + Supabase + OpenRouter
- TOOLS: Agent tools (if AI features)
- DEPENDENCIES: External services
- SYSTEM PROMPT(S): LLM behavior
- CORE FEATURES: 3 most important MVP features

Task 1 - Technical Architecture Agent:
"Analyze {{challenge}} and create technical architecture spec for Next.js + Supabase:
- Next.js App Router structure (app/ directory)
- API Routes design (/app/api/)
- Supabase database schema (tables, relationships, RLS policies)
- OpenRouter integration patterns (if AI features)
- Server Actions vs API Routes decisions
- Performance considerations (streaming, caching)
Save to: PRPs/specs/{{challenge|slugify}}-tech-spec.md"

Task 2 - User Experience Agent:
"Analyze {{challenge}} from UX perspective:
- User journeys and flows
- UI component requirements (Next.js client components)
- Interaction patterns (forms, real-time updates)
- Loading and error states
- Responsive design priorities
Save to: PRPs/specs/{{challenge|slugify}}-ux-spec.md"

Task 3 - Business Logic Agent:
"Define business rules and MVP logic for {{challenge}}:
- Core business rules (MVP ONLY)
- Critical validation requirements
- Must-have features for demo
- Data integrity rules
- Supabase RLS policies needed
Save to: PRPs/specs/{{challenge|slugify}}-business-spec.md"

Task 4 - Demo Impact Agent:
"Plan for maximum demo impact (MVP focus):
- 3 key features to highlight
- Demo script (2-3 minute walkthrough)
- Wow factors within MVP scope
- Demo data setup
- Backup plan if something breaks
Save to: PRPs/specs/{{challenge|slugify}}-demo-spec.md"

After agents complete:
1. Synthesize all specs into: PRPs/specs/{{challenge|slugify}}-unified-spec.md
2. Create Archon review tasks using mcp__archon__manage_task:
   - Task: "Review specs and approve MVP direction" (status: "review", assignee: "User")
   - Wait for user to mark this complete before proceeding
```

## Step 2: Implementation Planning (5 minutes)

Deploy 2 planning agents (removed Database, DevOps, Quality for MVP):

```
Use the Task tool to run these 2 planning agents in PARALLEL:

Task 5 - Backend Plan Agent:
"Create Next.js + Supabase backend implementation plan:
- Supabase schema creation (SQL migrations or dashboard)
- Row Level Security (RLS) policies (permissive for MVP)
- Next.js API routes structure (/app/api/)
- Server Actions for mutations
- Supabase client initialization
- OpenRouter API integration (if needed)
- Basic error handling patterns
Save to: PRPs/plans/{{challenge|slugify}}-backend-plan.md"

Task 6 - Frontend Plan Agent:
"Create Next.js frontend implementation plan:
- Component structure (App Router, client/server components)
- Form handling (React Hook Form + Zod)
- State management (TanStack Query for server state)
- Supabase client-side auth
- API integration patterns
- Tailwind styling approach
Save to: PRPs/plans/{{challenge|slugify}}-frontend-plan.md"

After completion:
Merge plans into: PRPs/plans/{{challenge|slugify}}-master-plan.md
```

## Step 3: Parallel MVP Implementation (10 minutes)

### Backend Implementation (3 agents - Next.js + Supabase):

```
Use the Task tool to run these 3 backend agents in PARALLEL:

Task 7 - Database & Schema Agent:
"Set up Supabase database:
1. Create tables in Supabase (use Supabase dashboard or SQL editor)
2. Add basic Row Level Security (RLS) policies - PERMISSIVE for MVP
3. Create sample seed data for demo
4. Set up Supabase client in Next.js (app/lib/supabase/)
5. Test connection with simple query
SKIP: Complex migrations, strict RLS, indexes
FOCUS: Working database with demo data
Report completion status."

Task 8 - API Routes & Server Actions Agent:
"Create Next.js backend logic:
1. Initialize Supabase client for server-side (app/lib/supabase/server.ts)
2. Create API routes in /app/api/ for core features
3. Implement Server Actions for mutations (use 'use server')
4. Add basic error handling (try/catch + error responses)
5. Integrate OpenRouter API if needed (app/lib/openrouter.ts)
SKIP: Comprehensive validation, rate limiting, extensive testing
FOCUS: Working endpoints that connect to Supabase
Report completion status."

Task 9 - Auth & Integration Agent:
"Set up authentication and wire everything:
1. Configure Supabase Auth (email/password or OAuth)
2. Add auth middleware if needed
3. Wire API routes together
4. Add basic logging (console.log for MVP)
5. Test end-to-end flow (auth → API → database)
SKIP: Complex auth flows, security hardening, monitoring
FOCUS: Basic working auth + integrated backend
Report completion status."
```

### Frontend Implementation (2 agents - Next.js UI):

```
Use the Task tool to run these 2 frontend agents in PARALLEL:

Task 10 - UI Components Agent:
"Build Next.js frontend:
1. Create page structure (app/page.tsx, app/[feature]/page.tsx)
2. Build core components (use 'use client' for interactive ones)
3. Add Tailwind CSS styling (basic, clean design)
4. Create forms with React Hook Form + Zod validation
5. Set up Supabase client-side for real-time (if needed)
SKIP: Animations, perfect responsiveness, accessibility audits
FOCUS: Functional UI that looks decent
Report completion status."

Task 11 - API Integration Agent:
"Connect frontend to backend:
1. Set up TanStack Query for data fetching
2. Create API client functions
3. Connect forms to Server Actions / API routes
4. Add loading states (simple spinners)
5. Add error handling (toast notifications or alerts)
SKIP: Optimistic updates, advanced caching, error boundaries
FOCUS: Working data flow from UI to database
Report completion status."
```

## Step 4: Integration & Demo Prep (4 minutes)

Final integration agent:

```
Use the Task tool to run this agent:

Task 12 - Integration & Demo Agent:
"Finalize MVP for demo:
1. Run `npm run dev` and test full user flow
2. Fix any critical bugs preventing demo
3. Set up demo data in Supabase
4. Create demo script (PRPs/demos/{{challenge|slugify}}/demo-script.md)
5. Take screenshots of working features
6. Note any known issues for backup plan
SKIP: Performance optimization, comprehensive testing
FOCUS: Demo-ready MVP that works for happy path
Save demo materials to: PRPs/demos/{{challenge|slugify}}/
Report demo readiness and any issues."
```

**After completion, create Archon tasks:**

```
Use mcp__archon__manage_task to create implementation tracking:

Task: "Backend implementation complete" (status: "review", assignee: "User")
Task: "Frontend implementation complete" (status: "review", assignee: "User")
Task: "MVP integration and demo ready" (status: "review", assignee: "User")

User reviews and marks complete or requests fixes.
```

## Execution Monitoring (Simplified)

```
## MVP Parallel Execution Status

### Spec Generation (Tasks 1-4) - 5 min
- [ ] Technical Architecture (Next.js + Supabase)
- [ ] User Experience
- [ ] Business Logic (MVP scope)
- [ ] Demo Impact

### Planning (Tasks 5-6) - 5 min
- [ ] Backend Plan (Next.js API + Supabase)
- [ ] Frontend Plan (Next.js UI)

### Implementation (Tasks 7-11) - 10 min
Backend:
- [ ] Database & Schema (Supabase)
- [ ] API Routes & Server Actions
- [ ] Auth & Integration

Frontend:
- [ ] UI Components (Next.js App Router)
- [ ] API Integration (TanStack Query)

### Integration (Task 12) - 4 min
- [ ] Integration & Demo Prep

### Metrics
- Total Agents: 12 (including Archon setup)
- Parallel Execution Groups: 4
- Estimated Time: 25 minutes
- Focus: MVP functionality over perfection
```

## Archon Integration Summary

**Throughout workflow, Archon provides:**
1. **Project tracking**: Persistent record of hackathon work
2. **Task management**: Review gates for user validation
3. **Knowledge base**: Research Next.js/Supabase patterns via RAG
4. **Documentation**: Specs and plans stored in Archon

**Use Archon tools:**
- `mcp__archon__rag_search_knowledge_base(query="Next.js API routes Supabase")` - Research patterns
- `mcp__archon__search_code_examples(query="Supabase RLS policies")` - Find examples
- `mcp__archon__manage_task(...)` - Track progress
- `mcp__archon__find_tasks(project_id="...")` - Check status

## MCP Server Integration Points

**Sequential Thinking** (use for complex decisions):
- Before Step 1: Analyze trade-offs in architecture decisions
- Use: `mcp__MCP_DOCKER__sequentialthinking` with complex tech choices

**Playwright** (use for testing, optional):
- After Step 4: Capture screenshots, test user flows
- Use: `browser_navigate`, `browser_snapshot`, `browser_take_screenshot`

**Obsidian** (use for post-mortem):
- After completion: Document learnings
- Use: `obsidian_append_content` to create hackathon journal

## Emergency MVP Protocols

If running behind schedule:
1. Reduce to ONLY Tasks 1, 3, 7, 8, 10, 12 (6 agents minimum)
2. Skip demo prep, do manual testing only
3. Use mock data instead of real Supabase
4. Hardcode values temporarily
5. Focus on ONE core feature working

## Success Metrics (MVP Edition)

- ✅ 12 agents (including setup) deliver MVP in 25 minutes
- ✅ Core feature works end-to-end (database → API → UI)
- ✅ Demo-ready (even if rough around edges)
- ✅ Archon project tracks all work for future iteration
- ✅ User can continue building on solid foundation

## Execution Command

```bash
# Start the MVP parallel execution
/hackathon-prp-parallel "PRPs/INITIAL.md"

# Or with brief description
/hackathon-prp-parallel "Build a recipe sharing app with AI-generated meal plans"
```

This streamlined MVP approach prioritizes working functionality over perfect code, gets you to a demo-ready state quickly, and uses Archon for persistent tracking so you can iterate after the hackathon!
