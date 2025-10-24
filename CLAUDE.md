# 🎮 Vibe Games Hackathon

**Ship velocity > perfection. Prototype swagger > analysis paralysis.**

Ready to cook?

---

# Universal AI Coding Global Rules

This file contains universal development principles and workflows that apply to **ALL projects**, regardless of technology stack. Project-specific rules are loaded conditionally based on the technologies you're using.

---

## 🎯 Core Development Principles

![[global-rules/core/universal-principles.md]]

---

## 🔄 PRP Development Workflow

![[global-rules/workflows/prp-methodology.md]]

---

## 🏛️ Archon Integration

![[global-rules/archon/CLAUDE.md]]

---

## 📚 Language & Framework-Specific Rules

The following rules are loaded based on your project's technology stack. Claude Code will use these when working with the respective technologies.

### Python Development

![[global-rules/python/rasmus--python-rules.md]]

### Pydantic AI Agents

**Use when building AI agents with Pydantic AI:**

![[global-rules/pydantic-ai/pydantic-ai-rules.md]]

### Next.js Development

**Use when building Next.js applications:**

![[global-rules/nextjs/rasmus--nextjs-rules.md]]

### React Development

**Use when working with React components:**

![[global-rules/react/rasmus--react-rules.md]]

### Node.js Backend Development

**Use when building Node.js APIs or backend services:**

![[global-rules/node/rasmus--node-rules.md]]

### Astro Static Sites

**Use when building Astro websites:**

![[global-rules/astro/rasmus--astro-rules.md]]

---

## 🎯 Project Type Detection

Claude Code automatically adapts based on project context:

- **Detects Python projects** → Applies Python rules + relevant framework rules
- **Detects Next.js/React** → Applies JavaScript/TypeScript + framework rules
- **Detects AI agent development** → Applies Pydantic AI specialized rules
- **Detects Node.js APIs** → Applies Node.js backend patterns
- **Detects Astro projects** → Applies static site generation rules

You can also explicitly tell Claude what you're building:
- "I'm building a Next.js app with..."
- "This is a Pydantic AI agent for..."
- "Working on a Node.js API that..."

---

## 🚀 Quick Start Guide

### For New Projects

1. **Define Requirements**: Create `PRPs/INITIAL.md`
2. **Generate PRP**: Run `/generate-prp PRPs/INITIAL.md`
3. **Review PRP**: Validate completeness
4. **Execute**: Run `/execute-prp PRPs/generated-prp.md`
5. **Validate**: Run validation gates

### For Existing Codebases

1. **Explore**: Run `/primer` or ask Claude to investigate
2. **Plan**: Collaborate on approach and architecture
3. **Create PRP**: Generate focused PRP for feature
4. **Execute**: Implement following PRP blueprint
5. **Validate**: Ensure all tests pass

---

## 📂 Project Organization

```
your-project/
├── .claude/
│   ├── commands/          # Custom slash commands
│   └── settings.local.json # Permissions
├── PRPs/
│   ├── INITIAL.md        # Requirements (new projects)
│   ├── templates/        # PRP templates by project type
│   └── *.md             # Generated PRPs
├── global-rules/         # Imported global rules (optional)
├── CLAUDE.md            # This file
├── .env.example         # Environment variable template
└── README.md            # Project documentation
```

---

## ✅ Universal Quality Standards

Every project, regardless of type, should meet these standards:

- **Code Quality**
  - Files < 500 lines
  - Functions < 50 lines
  - Clear naming conventions
  - Comprehensive error handling

- **Security**
  - No hardcoded secrets
  - Environment variables in .env
  - Input validation
  - Secure dependencies

- **Testing**
  - Minimum 80% coverage
  - Unit + integration tests
  - Edge case handling
  - Validation gates in PRPs

- **Documentation**
  - Clear README
  - Inline comments for complex logic
  - API documentation
  - Setup instructions

---

## 🔧 Available Tools & Workflows

### Slash Commands

- `/generate-prp` - Create comprehensive PRP from INITIAL.md
- `/execute-prp` - Implement feature from PRP
- `/primer` - Explore and understand codebase
- `/generate-pydantic-ai-prp` - Specialized AI agent PRP
- `/execute-pydantic-ai-prp` - Implement AI agent from PRP
- `/hackathon-prp-parallel` - Rapid parallel development

### MCP Servers

- **Archon** - Knowledge management, task tracking, RAG
- **Supabase** - Database MCP (configured, not yet in use - see Database Management below)

### Database Management

**Supabase PostgreSQL via Python (Current Approach):**

Use Python + psycopg2 for direct database operations:

```python
# Required dependencies: pip3 install psycopg2-binary python-dotenv
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv('.env.local')
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
```

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string from Supabase
  - Format: `postgresql://postgres.[project-ref]:[password]@[region].pooler.supabase.com:6543/postgres`
  - Get from: Supabase Dashboard → Settings → Database → Connection string → URI
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin access)

**Creating Tables:**
1. Write Python script with CREATE TABLE DDL
2. Use psycopg2 to execute SQL
3. Commit changes
4. Verify in Supabase Dashboard

**Example Pattern:**
See `/create_test_table.py` for reference implementation

**Future:** Will migrate to Supabase MCP server for AI-native database operations

### Development Tools

- **TodoWrite** - Track multi-step tasks within sessions
- **WebSearch** - Research documentation and examples
- **Glob/Grep** - Explore codebase patterns

---

## 🎓 Philosophy

This universal framework is built on these principles:

1. **PRP-Driven Development** - Structured planning enables one-pass implementation
2. **Context Engineering** - Comprehensive context yields quality results
3. **Progressive Validation** - Test early, test often, catch issues fast
4. **Technology Agnostic** - Core principles apply across all stacks
5. **Modular Loading** - Use only the rules relevant to your project
6. **Continuous Learning** - Refine PRPs and patterns based on experience

---

## 💡 Best Practices

- **Start with universal principles** - They apply to every project
- **Load framework rules as needed** - Don't overwhelm context with irrelevant rules
- **Create focused PRPs** - Target specific features, not entire systems
- **Validate progressively** - Syntax → Types → Tests → Integration
- **Document decisions** - Capture rationale in PRPs and commit messages
- **Iterate and improve** - Refine your PRP templates over time

---

**Welcome to universal AI-assisted development!** These rules enable you to build anything - from Next.js applications to AI agents to Python scripts - with consistent quality and structured workflows.
