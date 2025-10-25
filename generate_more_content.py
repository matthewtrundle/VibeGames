#!/usr/bin/env python3
"""
Generate additional demo content - 30 more documents
"""

import os
from datetime import datetime, timedelta
import random

# Additional documents
ADDITIONAL_DOCS = [
    # More product strategy
    ('product-strategy', 'okrs-q4-2024.md', 'OKRs Q4 2024', ['okrs', 'goals', 'strategy'],
     '# OKRs Q4 2024\n\n## Objective 1: Scale User Base\n- KR1: Reach 5,000 DAU\n- KR2: 25% MoM growth\n- KR3: 40% retention at Day 30\n\n## Objective 2: Improve Product\n- KR1: Ship mobile app\n- KR2: Reduce crashes by 80%\n- KR3: CSAT score > 85%'),

    ('product-strategy', 'market-research-findings.md', 'Market Research Findings', ['research', 'market', 'insights'],
     '# Market Research Findings\n\n## Market Size\n- Total addressable market: $5B\n- Serviceable market: $500M\n- Target market: $50M\n\n## Customer Segments\n1. Freelance creatives (40%)\n2. Small businesses (30%)\n3. Students (20%)\n4. Corporate teams (10%)'),

    ('product-strategy', 'feature-prioritization.md', 'Feature Prioritization Matrix', ['features', 'prioritization', 'strategy'],
     '# Feature Prioritization\n\n## High Impact / Low Effort\n- Dark mode polish ✅\n- Search improvements\n- Export to PDF\n\n## High Impact / High Effort\n- Mobile app\n- Real-time collaboration\n- AI features\n\n## Low Impact / Low Effort  \n- Theme customization\n- Keyboard shortcuts'),

    # More user research
    ('user-research', 'usability-test-results.md', 'Usability Test Results', ['research', 'ux', 'testing'],
     '# Usability Test Results - October 2024\n\n## Participants\n- 12 users\n- Mix of new and experienced\n- 60-min sessions\n\n## Key Findings\n- 83% could create a note without help\n- 67% struggled with tags\n- 92% loved the dark theme'),

    ('user-research', 'feature-request-log.md', 'Feature Request Log', ['feature-request', 'user-feedback', 'backlog'],
     '# Feature Request Log\n\n## Top Requests (Monthly)\n\n### November 2024\n1. Calendar integration (24 votes)\n2. Templates (18 votes)\n3. Better mobile editor (15 votes)\n4. API access (12 votes)\n5. Vim mode (8 votes)'),

    ('user-research', 'churn-analysis.md', 'Churn Analysis', ['research', 'metrics', 'retention'],
     '# Churn Analysis - Q3 2024\n\n## Churn Rate\n- Overall: 15% monthly\n- Free users: 18%\n- Paid users: 5%\n\n## Reasons for Churn\n1. Not enough features (35%)\n2. Too expensive (25%)\n3. Switched to competitor (20%)\n4. Bugs/technical issues (20%)'),

    # More marketing
    ('marketing', 'email-campaign-results.md', 'Email Campaign Results', ['marketing', 'email', 'analytics'],
     '# Email Campaign Results - October\n\n## Campaign: Feature Update\n- Sent: 8,500\n- Opened: 3,400 (40%)\n- Clicked: 850 (10%)\n- Converted: 45 (0.5%)\n\n## Best Performing Subject\n"Spooky New Features Just Dropped 🎃"'),

    ('marketing', 'influencer-partnerships.md', 'Influencer Partnerships', ['marketing', 'partnerships', 'growth'],
     '# Influencer Partnerships\n\n## Active Partnerships\n\n### @ProductivityGuru (50K followers)\n- Platform: YouTube\n- Deal: $1,000/video\n- Results: 800 signups\n\n### @DesignDaily (30K followers)\n- Platform: Instagram  \n- Deal: Product placement\n- Results: 450 signups'),

    ('marketing', 'seo-strategy.md', 'SEO Strategy', ['marketing', 'seo', 'growth'],
     '# SEO Strategy\n\n## Target Keywords\n1. "markdown note taking app" (2.4K/mo)\n2. "productivity app for creatives" (1.2K/mo)\n3. "obsidian alternative" (800/mo)\n\n## Current Rankings\n- "markdown note app": #15\n- "notion alternative": #8\n- "productivity tools": #42'),

    # More development
    ('development', 'api-documentation.md', 'API Documentation', ['development', 'api', 'documentation'],
     '# API Documentation\n\n## Authentication\nUse Bearer token in Authorization header\n\n## Endpoints\n\n### GET /api/notes\nList all notes\n\n### POST /api/notes\nCreate a new note\n\n### GET /api/notes/:id\nGet note by ID\n\n### PUT /api/notes/:id\nUpdate note'),

    ('development', 'performance-optimization-plan.md', 'Performance Optimization Plan', ['development', 'performance', 'optimization'],
     '# Performance Optimization Plan\n\n## Current Issues\n- Initial load: 3.2s (target: <1s)\n- Search: 800ms (target: <200ms)\n- Image loading: Slow\n\n## Solutions\n1. Code splitting\n2. Lazy loading\n3. CDN for static assets\n4. Database indexing'),

    ('development', 'security-audit-findings.md', 'Security Audit Findings', ['development', 'security', 'priority-high'],
     '# Security Audit - October 2024\n\n## Critical Issues\n- None found ✅\n\n## Medium Priority\n1. Add rate limiting on API\n2. Implement CSRF tokens\n3. Upgrade dependencies\n\n## Recommendations\n- Regular security scans\n- Penetration testing\n- Bug bounty program'),

    # More design
    ('design', 'accessibility-guidelines.md', 'Accessibility Guidelines', ['design', 'accessibility', 'a11y'],
     '# Accessibility Guidelines\n\n## WCAG 2.1 AA Compliance\n\n### Color Contrast\n- Text: 4.5:1 minimum\n- Large text: 3:1 minimum\n- UI components: 3:1 minimum\n\n### Keyboard Navigation\n- All features accessible via keyboard\n- Focus indicators visible\n- Skip links provided'),

    ('design', 'dark-mode-specifications.md', 'Dark Mode Specifications', ['design', 'dark-mode', 'ui'],
     '# Dark Mode Specifications\n\n## Background Colors\n- Primary: #0a0a0a\n- Secondary: #1a1a1a\n- Elevated: #2a2a2a\n\n## Text Colors\n- Primary: #ffffff\n- Secondary: #b0b0b0\n- Disabled: #606060\n\n## Accent Colors\n- Orange: #ff6b35\n- Red: #c1121f'),

    ('design', 'icon-library.md', 'Icon Library', ['design', 'icons', 'assets'],
     '# Icon Library\n\n## Icons Used\n- Heroicons (primary)\n- Lucide (supplementary)\n\n## Custom Icons\n- Headless horseman logo\n- Spooky cursor\n- Pumpkin loading spinner\n\n## Guidelines\n- 24x24px default size\n- 2px stroke width\n- Rounded corners'),

    # More analytics
    ('analytics', 'ab-test-results.md', 'A/B Test Results', ['analytics', 'testing', 'optimization'],
     '# A/B Test Results\n\n## Test: CTA Button Color\n\n### Variant A (Orange)\n- Clicks: 450\n- Conversion: 12%\n\n### Variant B (Red)\n- Clicks: 520\n- Conversion: 14%\n\n**Winner:** Variant B (+17% conversion)'),

    ('analytics', 'revenue-metrics.md', 'Revenue Metrics', ['analytics', 'revenue', 'metrics'],
     '# Revenue Metrics - Q3 2024\n\n## Monthly Recurring Revenue\n- MRR: $12,500\n- Growth: +22% MoM\n- Churn: $800/month\n\n## Customer Lifetime Value\n- Average: $245\n- Paid users: $680\n- Free users: $0'),

    ('analytics', 'error-tracking-dashboard.md', 'Error Tracking Dashboard', ['analytics', 'errors', 'monitoring'],
     '# Error Tracking - October 2024\n\n## Top Errors\n1. Network timeout (245 occurrences)\n2. Sync conflict (180 occurrences)\n3. Image load failure (95 occurrences)\n\n## Resolution Status\n- Fixed: 340\n- In progress: 120\n- Open: 60'),

    # More customer support
    ('customer-support', 'customer-success-playbook.md', 'Customer Success Playbook', ['support', 'playbook', 'documentation'],
     '# Customer Success Playbook\n\n## Onboarding\n\n### Day 1\n- Welcome email\n- Tutorial prompts\n- Check-in message\n\n### Week 1\n- Usage review\n- Feature highlights\n- Upgrade prompt\n\n### Month 1\n- Success survey\n- Testimonial request\n- Referral ask'),

    ('customer-support', 'refund-policy.md', 'Refund Policy', ['support', 'policy', 'billing'],
     '# Refund Policy\n\n## Standard Refunds\n- 30-day money-back guarantee\n- No questions asked\n- Full refund processed\n\n## Process\n1. Customer requests refund\n2. Verify within 30 days\n3. Process within 5 business days\n4. Follow up email'),

    ('customer-support', 'knowledge-base-articles.md', 'Knowledge Base Top Articles', ['support', 'documentation', 'kb'],
     '# Knowledge Base Top Articles\n\n## Most Viewed\n1. "How to sync across devices" (12,500 views)\n2. "Markdown syntax guide" (8,200 views)\n3. "Export your notes" (6,100 views)\n\n## Most Helpful\n1. "Troubleshooting sync" (95% helpful)\n2. "Dark mode setup" (92% helpful)'),

    # More operations
    ('operations', 'incident-response-plan.md', 'Incident Response Plan', ['operations', 'incident', 'security'],
     '# Incident Response Plan\n\n## Severity Levels\n\n### P0: Critical\n- App down\n- Data breach\n- Response: Immediate\n\n### P1: High\n- Feature broken\n- Performance degraded\n- Response: <2 hours\n\n### P2: Medium\n- Minor bugs\n- Response: <1 day'),

    ('operations', 'vendor-management.md', 'Vendor Management', ['operations', 'vendors', 'procurement'],
     '# Vendor Management\n\n## Current Vendors\n\n### Supabase\n- Service: Database\n- Cost: $25/month\n- Contract: Monthly\n\n### Vercel\n- Service: Hosting\n- Cost: $20/month\n- Contract: Monthly\n\n### OpenAI\n- Service: AI\n- Cost: ~$50/month\n- Contract: Pay-as-you-go'),

    ('operations', 'quarterly-business-review.md', 'Q3 2024 Business Review', ['operations', 'qbr', 'review'],
     '# Q3 2024 Quarterly Business Review\n\n## Wins\n- Reached 1,000+ DAU\n- Shipped dark mode\n- $12K MRR achieved\n\n## Challenges\n- Mobile crashes\n- Slow growth\n- High churn\n\n## Q4 Focus\n- Fix stability\n- Launch mobile\n- Hit $20K MRR'),

    # Additional varied content
    ('product-logs', 'feature-launch-retrospective.md', 'Feature Launch Retrospective', ['retrospective', 'launch', 'learnings'],
     '# Dark Mode Launch Retrospective\n\n## What Went Well\n- Smooth rollout\n- 82% adoption rate\n- Positive feedback\n\n## What Could Improve\n- Better testing\n- More communication\n- Phased rollout\n\n## Action Items\n- Create launch checklist\n- Involve QA earlier'),

    ('feedback', 'beta-tester-feedback.md', 'Beta Tester Feedback Summary', ['feedback', 'beta', 'user-testing'],
     '# Beta Tester Feedback - Mobile App\n\n## Overall Sentiment\n- Excited: 78%\n- Neutral: 15%\n- Disappointed: 7%\n\n## Top Praise\n- Fast and smooth\n- Beautiful UI\n- Love the theme\n\n## Top Issues\n- Crashes on Android\n- Sync delays\n- Missing features'),

    ('random-notes', 'competitive-intel.md', 'Competitive Intelligence Notes', ['competitive', 'research', 'intel'],
     '# Competitive Intelligence\n\n## Notion Updates\n- Launched AI features\n- $10B valuation\n- Expanding to Japan\n\n## Obsidian News\n- Canvas feature popular\n- Mobile app improved\n- Community growing\n\n## Our Differentiation\n- Simpler UX\n- Spooky theme\n- Better performance'),

    ('random-notes', 'founder-reflections.md', 'Founder Reflections November', ['reflection', 'founder', 'personal'],
     '# Founder Reflections - November 2024\n\n## This Month I Learned\n- Shipping fast > perfect\n- Users forgive bugs if you fix them quickly\n- Community is everything\n\n## Grateful For\n- Amazing early users\n- Supportive team\n- The journey\n\n## Next Month Goals\n- Hit 2,000 DAU\n- Ship mobile app\n- Take a vacation'),

    ('random-notes', 'product-ideas-backlog.md', 'Product Ideas Backlog', ['ideas', 'backlog', 'brainstorm'],
     '# Product Ideas Backlog\n\n## High Potential\n- Browser extension\n- Desktop app\n- Voice notes\n- Calendar integration\n\n## Experimental\n- Gamification\n- Social features\n- NFT profile pictures\n- Blockchain backup (lol jk)\n\n## Maybe Someday\n- VR note taking\n- AI that writes notes for you'),

    ('random-notes', 'tech-debt-log.md', 'Technical Debt Log', ['tech-debt', 'development', 'refactoring'],
     '# Technical Debt Log\n\n## High Priority\n- Refactor authentication system\n- Update React Router to v7\n- Remove unused dependencies\n\n## Medium Priority\n- Improve test coverage (currently 45%)\n- Standardize error handling\n- Document API endpoints\n\n## Low Priority\n- Prettier code formatting\n- Cleanup console.logs'),
]

def create_document(folder, filename, title, tags, content):
    """Create a markdown document with frontmatter"""
    days_ago = random.randint(1, 60)
    date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')

    frontmatter = f"""---
title: {title}
date: {date}
tags: {tags}
---

"""
    full_content = frontmatter + content

    filepath = os.path.join('demo-vault', folder, filename)
    with open(filepath, 'w') as f:
        f.write(full_content)

    print(f"✓ Created: {folder}/{filename}")

def main():
    print("🎃 Generating additional demo content\n")

    for folder, filename, title, tags, content in ADDITIONAL_DOCS:
        create_document(folder, filename, title, tags, content)

    print(f"\n🎉 Created {len(ADDITIONAL_DOCS)} more documents!")

if __name__ == '__main__':
    main()
