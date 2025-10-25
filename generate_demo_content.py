#!/usr/bin/env python3
"""
Generate demo vault content for Headless Horseman Quest
Creates 50+ documents with proper frontmatter, tags, and folder organization
"""

import os
from datetime import datetime, timedelta
import random

# Folder structure
FOLDERS = {
    'product-strategy': {
        'docs': [
            ('product-roadmap-q4-2024.md', 'Product Roadmap Q4 2024', ['roadmap', 'strategy', 'priority-high'],
             '# Q4 2024 Product Roadmap\n\n## Vision\nBecome the #1 spooky productivity app for creative professionals.\n\n## Key Initiatives\n\n### 1. Mobile App Launch\n- **Status:** In Development\n- **Target:** November 2024\n- **Features:** Full sync with desktop, offline mode, dark theme\n\n### 2. AI-Powered Task Suggestions\n- **Status:** Research Phase\n- **Target:** December 2024  \n- **Description:** Use AI to suggest tasks based on user patterns\n\n### 3. Team Collaboration Features\n- **Status:** Planned\n- **Target:** Q1 2025\n- **Features:** Shared vaults, real-time collaboration, comments'),

            ('competitive-analysis-2024.md', 'Competitive Analysis 2024', ['research', 'strategy', 'market'],
             '# Competitive Analysis 2024\n\n## Direct Competitors\n\n### Notion\n- **Strengths:** Feature-rich, great collaboration\n- **Weaknesses:** Overwhelming for new users, slow performance\n- **Our Advantage:** Simpler UX, spooky theme, faster\n\n### Obsidian\n- **Strengths:** Local-first, powerful linking\n- **Weaknesses:** No mobile app, steep learning curve\n- **Our Advantage:** Cloud sync, mobile-first\n\n## Market Opportunity\n- TAM: $5B productivity software market\n- Our niche: Creative professionals who want fun + function'),

            ('pricing-strategy.md', 'Pricing Strategy', ['pricing', 'strategy', 'revenue'],
             '# Pricing Strategy\n\n## Current Tiers\n\n### Free\n- 100 notes\n- 1 vault\n- Basic features\n\n### Pro ($9/month)\n- Unlimited notes\n- Unlimited vaults\n- AI features\n- Priority support\n\n### Team ($29/month)\n- Everything in Pro\n- Team collaboration\n- Admin controls\n- Advanced analytics'),
        ]
    },

    'user-research': {
        'docs': [
            ('user-interview-summary-nov.md', 'User Interview Summary November', ['research', 'user-feedback', 'insights'],
             '# User Interview Summary - November 2024\n\n## Key Findings\n\n### What Users Love\n1. The spooky theme makes work fun\n2. Fast and responsive interface\n3. Simple markdown editing\n\n### Pain Points\n1. Mobile app crashes frequently\n2. No collaboration features\n3. Search could be better\n\n### Quote of the Month\n"This app makes me actually want to do my tasks!" - Sarah, Designer'),

            ('user-personas.md', 'User Personas', ['research', 'personas', 'strategy'],
             '# User Personas\n\n## Persona 1: Creative Chloe\n- **Age:** 28\n- **Job:** Freelance Designer\n- **Goals:** Organize project ideas, track client work\n- **Frustrations:** Existing tools are too corporate\n\n## Persona 2: Developer Dan\n- **Age:** 35\n- **Job:** Software Engineer\n- **Goals:** Technical notes, code snippets, documentation\n- **Frustrations:** Wants markdown, not WYSIWYG'),

            ('survey-results-satisfaction.md', 'User Satisfaction Survey Results', ['research', 'metrics', 'user-feedback'],
             '# User Satisfaction Survey - October 2024\n\n## Response Rate\n- Sent: 1,000 surveys\n- Responses: 324 (32.4%)\n\n## Net Promoter Score\n- **Score:** 42 (Good)\n- Promoters: 55%\n- Passives: 32%\n- Detractors: 13%\n\n## Top Feature Requests\n1. Mobile app improvements (68%)\n2. Team collaboration (54%)\n3. Better search (47%)'),
        ]
    },

    'marketing': {
        'docs': [
            ('content-calendar-nov.md', 'Content Calendar November', ['marketing', 'content', 'social-media'],
             '# Content Calendar - November 2024\n\n## Week 1\n- **Monday:** Blog post - "10 Spooky Ways to Boost Productivity"\n- **Wednesday:** Twitter thread on markdown tips\n- **Friday:** Product update video\n\n## Week 2\n- **Monday:** User success story\n- **Wednesday:** Feature spotlight - AI suggestions\n- **Friday:** Behind the scenes - development'),

            ('launch-campaign-mobile.md', 'Mobile App Launch Campaign', ['marketing', 'campaign', 'priority-high'],
             '# Mobile App Launch Campaign\n\n## Timeline\n- **Pre-launch:** November 1-14\n- **Launch:** November 15\n- **Post-launch:** November 16-30\n\n## Channels\n1. Email blast to 10,000 users\n2. Social media campaign\n3. Product Hunt launch\n4. Press outreach\n\n## Goals\n- 5,000 downloads in first week\n- 4.5+ star rating\n- Featured on Product Hunt'),

            ('social-media-analytics.md', 'Social Media Analytics Q3', ['marketing', 'analytics', 'metrics'],
             '# Social Media Analytics - Q3 2024\n\n## Twitter\n- Followers: 5,200 (+1,200)\n- Engagement rate: 3.2%\n- Top post: Mobile app teaser (850 likes)\n\n## Instagram\n- Followers: 3,100 (+800)\n- Engagement rate: 5.1%\n- Top post: UI design showcase\n\n## LinkedIn\n- Followers: 1,800 (+400)\n- Engagement rate: 2.1%\n- Top post: Founder story'),
        ]
    },

    'development': {
        'docs': [
            ('tech-stack-overview.md', 'Technical Stack Overview', ['development', 'architecture', 'documentation'],
             '# Technical Stack Overview\n\n## Frontend\n- **Framework:** Next.js 14\n- **Language:** TypeScript\n- **Styling:** Tailwind CSS\n- **State:** Zustand\n\n## Backend\n- **Database:** Supabase (PostgreSQL)\n- **Vector Search:** pgvector\n- **API:** Next.js API Routes\n\n## AI/ML\n- **Embeddings:** OpenAI ada-002\n- **Chat:** OpenRouter (Claude 3.5)'),

            ('sprint-planning-nov-15.md', 'Sprint Planning November 15', ['development', 'sprint', 'planning'],
             '# Sprint Planning - November 15, 2024\n\n## Sprint Goals\n1. Fix mobile crash bugs\n2. Implement dark mode polish\n3. Add performance monitoring\n\n## Stories\n- **DEV-101:** Fix React Native crash on Android\n- **DEV-102:** Optimize image loading\n- **DEV-103:** Add Sentry error tracking\n- **DEV-104:** Dark mode UI refinements'),

            ('code-review-guidelines.md', 'Code Review Guidelines', ['development', 'process', 'documentation'],
             '# Code Review Guidelines\n\n## Before Submitting\n- [ ] All tests pass\n- [ ] Linting passes\n- [ ] No console.logs\n- [ ] Updated documentation\n\n## Review Checklist\n- [ ] Code is readable\n- [ ] No security issues\n- [ ] Performance considerations\n- [ ] Proper error handling'),
        ]
    },

    'design': {
        'docs': [
            ('design-system-v2.md', 'Design System V2', ['design', 'ui', 'documentation'],
             '# Design System V2\n\n## Colors\n\n### Primary\n- Midnight Black: #0a0a0a\n- Ghost White: #f5f5f5\n- Pumpkin Orange: #ff6b35\n\n### Accent\n- Blood Red: #c1121f\n- Fog Gray: #778da9\n\n## Typography\n- **Headings:** Inter Bold\n- **Body:** Inter Regular\n- **Code:** Fira Code'),

            ('mobile-mockups-v3.md', 'Mobile App Mockups V3', ['design', 'mobile', 'mockups'],
             '# Mobile App Mockups V3\n\n## Home Screen\n- Bottom navigation\n- Quick add button (floating)\n- Recent notes carousel\n- Search bar at top\n\n## Note Editor\n- Full-screen markdown\n- Toolbar for formatting\n- Dark mode optimized\n- Auto-save indicator'),

            ('user-flow-onboarding.md', 'Onboarding User Flow', ['design', 'ux', 'onboarding'],
             '# Onboarding User Flow\n\n## Step 1: Welcome\n- Show value proposition\n- Spooky animation\n- Skip option\n\n## Step 2: Create Vault\n- Name your vault\n- Choose theme\n- Example templates\n\n## Step 3: First Note\n- Guided note creation\n- Markdown tips\n- Save and celebrate'),
        ]
    },

    'analytics': {
        'docs': [
            ('usage-metrics-oct.md', 'Usage Metrics October', ['analytics', 'metrics', 'data'],
             '# Usage Metrics - October 2024\n\n## Daily Active Users\n- Average: 1,250\n- Peak: 1,580 (Oct 15)\n- Growth: +15% MoM\n\n## Engagement\n- Notes created: 45,000\n- Search queries: 120,000\n- Time in app: 18 min average\n\n## Retention\n- Day 1: 65%\n- Day 7: 42%\n- Day 30: 28%'),

            ('conversion-funnel.md', 'Conversion Funnel Analysis', ['analytics', 'conversion', 'metrics'],
             '# Conversion Funnel Analysis\n\n## Signup to Free User\n- Visitors: 10,000\n- Signups: 1,200 (12%)\n- Activation: 800 (66%)\n\n## Free to Paid\n- Free users: 5,000\n- Trial starts: 500 (10%)\n- Conversions: 150 (30%)\n\n## Key Insights\n- Drop-off at trial start\n- Need better value communication'),

            ('feature-usage-breakdown.md', 'Feature Usage Breakdown', ['analytics', 'features', 'data'],
             '# Feature Usage Breakdown\n\n## Most Used Features\n1. Markdown editor (95% of users)\n2. Search (78%)\n3. Tags (65%)\n4. Dark mode (82%)\n5. Export (34%)\n\n## Least Used\n1. Templates (12%)\n2. Collaboration (5%)\n3. API access (3%)'),
        ]
    },

    'customer-support': {
        'docs': [
            ('faq-common-issues.md', 'FAQ - Common Issues', ['support', 'documentation', 'faq'],
             '# FAQ - Common Issues\n\n## How do I sync between devices?\n1. Create an account\n2. Enable sync in settings\n3. Login on other devices\n4. Your vaults sync automatically\n\n## The app won\'t open\n- Try restarting your device\n- Check for app updates\n- Clear app cache\n- Reinstall if needed\n\n## How do I export my notes?\n- Go to Settings > Export\n- Choose format (Markdown, PDF, JSON)\n- Select destination'),

            ('support-ticket-trends.md', 'Support Ticket Trends', ['support', 'metrics', 'analysis'],
             '# Support Ticket Trends - October 2024\n\n## Volume\n- Total tickets: 245\n- Average response time: 2.3 hours\n- Resolution time: 8.5 hours\n\n## Top Issues\n1. Mobile crashes (35%)\n2. Sync problems (22%)\n3. Feature requests (18%)\n4. Billing questions (15%)\n\n## Customer Satisfaction\n- CSAT score: 87%\n- Improvement: +5% from last month'),

            ('escalation-procedures.md', 'Support Escalation Procedures', ['support', 'process', 'documentation'],
             '# Support Escalation Procedures\n\n## Level 1: Support Team\n- Response time: < 4 hours\n- Handle: Basic questions, billing\n- Tools: Help center, Intercom\n\n## Level 2: Technical Team\n- Response time: < 1 day\n- Handle: Bug reports, technical issues\n- Tools: GitHub, Sentry\n\n## Level 3: Engineering\n- Response time: < 2 days\n- Handle: Critical bugs, data issues\n- Tools: Database access, logs'),
        ]
    },

    'operations': {
        'docs': [
            ('team-handbook.md', 'Team Handbook', ['operations', 'documentation', 'team'],
             '# Team Handbook\n\n## Our Values\n1. **User-first:** Every decision considers user impact\n2. **Move fast:** Ship quickly, iterate often\n3. **Transparency:** Open communication\n4. **Quality:** Polish matters\n\n## Working Hours\n- Flexible schedule\n- Core hours: 10am-3pm local time\n- Async communication\n\n## Tools\n- Slack for chat\n- Linear for tasks\n- Notion for docs\n- GitHub for code'),

            ('hiring-plan-2025.md', 'Hiring Plan 2025', ['operations', 'hiring', 'planning'],
             '# Hiring Plan 2025\n\n## Q1 Hires\n- Senior Backend Engineer\n- Product Designer\n- Customer Success Manager\n\n## Q2 Hires\n- Mobile Developer (iOS)\n- Mobile Developer (Android)\n- Marketing Manager\n\n## Budget\n- Total: $500K\n- Average: $85K per hire'),

            ('remote-work-policy.md', 'Remote Work Policy', ['operations', 'policy', 'team'],
             '# Remote Work Policy\n\n## Location\n- Work from anywhere\n- Must overlap 3+ hours with team\n- Good internet required\n\n## Equipment\n- $2,000 laptop budget\n- $500 home office stipend\n- $50/month co-working allowance\n\n## Communication\n- Daily standups (async)\n- Weekly all-hands\n- Monthly 1:1s'),
        ]
    }
}

def create_document(folder, filename, title, tags, content):
    """Create a markdown document with frontmatter"""

    # Generate random date in the past 60 days
    days_ago = random.randint(1, 60)
    date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')

    # Create frontmatter
    frontmatter = f"""---
title: {title}
date: {date}
tags: {tags}
---

"""

    # Full content
    full_content = frontmatter + content

    # Write file
    filepath = os.path.join('demo-vault', folder, filename)
    with open(filepath, 'w') as f:
        f.write(full_content)

    print(f"✓ Created: {folder}/{filename}")

def main():
    print("🎃 Generating demo content for Headless Horseman Quest\n")

    total_docs = 0

    for folder, data in FOLDERS.items():
        for filename, title, tags, content in data['docs']:
            create_document(folder, filename, title, tags, content)
            total_docs += 1

    print(f"\n🎉 Created {total_docs} documents across {len(FOLDERS)} folders!")
    print("\nFolders created:")
    for folder in FOLDERS.keys():
        count = len(FOLDERS[folder]['docs'])
        print(f"  - {folder}: {count} docs")

if __name__ == '__main__':
    main()
