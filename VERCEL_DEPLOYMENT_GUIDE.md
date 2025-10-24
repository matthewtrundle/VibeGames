# 🚀 Vercel Deployment Guide

Your RAG-powered chat application is now **100% Vercel-compatible** and ready to deploy!

---

## ✅ Pre-Deployment Checklist

### Local Testing Complete
- ✅ RAG endpoint using OpenAI embeddings (1536-dim)
- ✅ Supabase pgvector search working
- ✅ All 96 chunks indexed with embeddings
- ✅ Chat integration using RAG semantic search
- ✅ No Python dependencies (fully serverless)

### What's Been Fixed
- ✅ Removed Python subprocess calls
- ✅ Migrated from sentence-transformers to OpenAI API
- ✅ Using Supabase JS client for database operations
- ✅ All code is TypeScript/JavaScript (Vercel-compatible)

---

## 📋 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Vercel-ready RAG app"
```

### 1.2 Create .gitignore (if not already present)

Make sure these are in your `.gitignore`:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Python (not needed on Vercel, but keep for local dev)
*.pyc
__pycache__/
venv/
.python-version

# Supabase (optional - keep migrations private)
supabase/.branches
supabase/.temp
```

### 1.3 Push to GitHub

```bash
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

### 2.2 Configure Project

Vercel will auto-detect Next.js:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

Click "Deploy" - but it will fail without environment variables!

---

## 🔐 Step 3: Add Environment Variables

### 3.1 Navigate to Environment Variables

In your Vercel project:
1. Go to **Settings** → **Environment Variables**
2. Add all the following variables

### 3.2 Required Environment Variables

Copy these from your `.env.local` file:

#### OpenAI (for RAG embeddings)
```bash
OPENAI_API_KEY=sk-proj-...
```

#### OpenRouter (for chat completions)
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

#### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ruqcuvuxmjczqbfkdfuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres.ruqcuvuxmjczqbfkdfuk:...
```

### 3.3 Environment Variable Settings

For each variable:
- **Environment:** Select all (Production, Preview, Development)
- **Value:** Paste the value from your `.env.local`
- Click "Add"

---

## 🔄 Step 4: Redeploy

### 4.1 Trigger Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** (⋯) → **Redeploy**
4. Or push a new commit to trigger automatic deployment

### 4.2 Watch the Build

Monitor the build logs:
- Should complete in ~2-3 minutes
- Look for "✓ Build Completed"
- Check for any errors

---

## ✅ Step 5: Verify Deployment

### 5.1 Test the Deployment

Visit your Vercel URL: `https://your-app.vercel.app`

You should see:
- ✅ Chat interface loads
- ✅ Vault files display in sidebar
- ✅ Chat responds to queries
- ✅ RAG context is used in responses

### 5.2 Test RAG Endpoint

```bash
curl -X POST https://your-app.vercel.app/api/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "What bugs are mentioned?", "matchCount": 5}'
```

**Expected Response:**
```json
{
  "success": true,
  "query": "What bugs are mentioned?",
  "chunks": [ ... ],
  "count": 5
}
```

### 5.3 Test Chat with RAG

Visit the chat interface and ask:
- "What are the main bugs users are reporting?"
- "Summarize the Q3 survey results"
- "What features are users requesting?"

The AI should cite specific files from your vault, proving RAG is working!

---

## 🔧 Troubleshooting

### Issue 1: Build Fails

**Error:** `Module not found: Can't resolve '@supabase/supabase-js'`

**Fix:**
```bash
npm install @supabase/supabase-js
git add package.json package-lock.json
git commit -m "Add missing dependencies"
git push
```

### Issue 2: Environment Variables Not Working

**Symptoms:** 500 errors, "Missing environment variable" logs

**Fix:**
1. Go to Settings → Environment Variables
2. Verify all variables are set for **Production**
3. Click **Redeploy** (not just push code)

### Issue 3: RAG Returns No Results

**Symptoms:** Chat works but doesn't cite vault files

**Fix:**
1. Check Supabase database has embeddings:
   ```sql
   SELECT COUNT(*) FROM markdown_chunks WHERE embedding IS NOT NULL;
   ```
2. Should return 96 (or your chunk count)
3. If 0, re-run indexing script locally, then verify in Supabase dashboard

### Issue 4: OpenAI Rate Limits

**Symptoms:** "Rate limit exceeded" errors

**Fix:**
- OpenAI free tier: 3 RPM (requests per minute)
- Consider upgrading to paid tier for production
- Or add request throttling in your app

### Issue 5: Supabase Connection Issues

**Symptoms:** "Connection timeout" errors

**Fix:**
1. Verify `DATABASE_URL` uses **Transaction pooler** (port 6543)
2. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
3. Get from Supabase Dashboard → Settings → Database → Connection string

---

## 📊 Post-Deployment Monitoring

### Vercel Analytics

Enable Vercel Analytics:
1. Go to **Analytics** tab
2. Click "Enable Analytics"
3. Monitor:
   - Page views
   - API endpoint performance
   - Error rates

### Vercel Logs

Monitor real-time logs:
1. Go to **Deployments** → **Latest Deployment**
2. Click **View Function Logs**
3. Look for:
   - `👻 [RAG]` - RAG search logs
   - `👻 [Context]` - Context selection logs
   - `👻 [Success]` - Successful responses

### Supabase Monitoring

Check database health:
1. Go to Supabase Dashboard → **Reports**
2. Monitor:
   - Database size
   - Query performance
   - API requests

---

## 💰 Cost Breakdown (Production)

### OpenAI Embeddings
- **Per query:** ~$0.00001 (1/100th of a cent)
- **100 queries:** ~$0.001 (1/10th of a cent)
- **1,000 queries:** ~$0.01 (1 cent)
- **10,000 queries:** ~$0.10 (10 cents)

**Bottom line:** Extremely cheap for production use!

### OpenRouter (Chat Completions)
- Depends on your selected model
- Claude 3.5 Sonnet: ~$3 per million input tokens
- Check current pricing: https://openrouter.ai/models

### Supabase
- **Free tier:** Up to 500 MB database, 2 GB bandwidth
- **Pro tier ($25/mo):** 8 GB database, 50 GB bandwidth
- Your 96 chunks use minimal storage (~500 KB)

### Vercel
- **Hobby (Free):** 100 GB bandwidth, serverless functions
- **Pro ($20/mo):** 1 TB bandwidth, enhanced performance
- Your app fits comfortably in free tier for development

---

## 🔐 Security Best Practices

### 1. Rotate API Keys Regularly

```bash
# Update keys every 90 days:
# 1. Generate new OpenAI key
# 2. Generate new Supabase service role key
# 3. Update in Vercel settings
# 4. Revoke old keys
```

### 2. Enable Supabase RLS (Row Level Security)

For production, add RLS policies:

```sql
-- Enable RLS on tables
ALTER TABLE markdown_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE markdown_files ENABLE ROW LEVEL SECURITY;

-- Add policies (example - customize for your needs)
CREATE POLICY "Public read access" ON markdown_chunks
  FOR SELECT USING (true);
```

### 3. Add Rate Limiting

Install rate limiter:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Add to API routes:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

// In API route:
const { success } = await ratelimit.limit(req.ip);
if (!success) {
  return Response.json({ error: "Too many requests" }, { status: 429 });
}
```

### 4. Monitor for Abuse

Set up Vercel alerts:
1. Go to Settings → Notifications
2. Enable alerts for:
   - High error rates
   - Unusual bandwidth spikes
   - Function timeout warnings

---

## 🎯 Performance Optimization

### 1. Enable Vercel Edge Caching

Add caching headers to RAG responses:

```typescript
// In app/api/rag/route.ts
return Response.json(result, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  }
});
```

### 2. Optimize Supabase Queries

```sql
-- Ensure index exists
CREATE INDEX IF NOT EXISTS idx_chunks_embedding
ON markdown_chunks
USING hnsw (embedding vector_cosine_ops);

-- Analyze table for better query plans
ANALYZE markdown_chunks;
```

### 3. Use Vercel Edge Functions

For even faster responses, convert to Edge Runtime:

```typescript
// Add to top of app/api/rag/route.ts
export const runtime = 'edge';
```

---

## 📈 Scaling Considerations

### If Your Vault Grows Large (1000+ Files)

1. **Increase match_count threshold:**
   ```typescript
   const results = await searchSimilarChunks(queryEmbedding, 20, 0.3);
   ```

2. **Add pagination to results:**
   ```typescript
   const { page = 1, perPage = 10 } = body;
   // Implement offset/limit in Supabase query
   ```

3. **Consider vector index tuning:**
   ```sql
   -- Adjust HNSW parameters for larger datasets
   CREATE INDEX chunks_embedding_idx ON markdown_chunks
   USING hnsw (embedding vector_cosine_ops)
   WITH (m = 32, ef_construction = 128); -- Larger values = better accuracy, slower build
   ```

### If Traffic Grows (1000+ Users)

1. **Upgrade Vercel plan** to Pro ($20/mo)
2. **Upgrade Supabase plan** to Pro ($25/mo)
3. **Enable connection pooling** (already using pooler)
4. **Add Redis caching** for frequently asked queries

---

## 🎉 You're Done!

Your RAG-powered chat app is now live on Vercel!

**What You've Achieved:**
- ✅ Fully serverless RAG implementation
- ✅ Semantic search with pgvector
- ✅ AI chat with relevant context
- ✅ Production-ready on Vercel
- ✅ Scalable and cost-effective

**Next Steps:**
1. Share your Vercel URL with users
2. Monitor logs and analytics
3. Iterate based on feedback
4. Add custom domain (optional)

**Your Vercel URL:**
```
https://your-app.vercel.app
```

Enjoy your deployed app! 🚀👻
