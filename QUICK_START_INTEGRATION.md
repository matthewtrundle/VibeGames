# 🚀 Quick Start: Integration Utilities

Quick reference guide for using the new integration utilities in "The Headless Horseman's Quest".

---

## 📦 What Was Added?

1. **Enhanced API Client** - `/lib/api-client.ts`
2. **Error Boundary** - `/lib/error-boundary.tsx`
3. **ARIA Labels** - All components updated
4. **Validation Script** - `/scripts/validate-demo-vault.js`
5. **Testing Checklist** - `/TESTING_CHECKLIST.md`

---

## 🔧 How to Use Each Utility

### 1. Enhanced API Client

**Replace basic fetch with enhanced version:**

```typescript
// ❌ OLD WAY (basic)
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify(data)
})
const result = await response.json()

// ✅ NEW WAY (enhanced)
import { sendChatMessage } from '@/lib/api-client'

try {
  const result = await sendChatMessage(data)
} catch (error) {
  // Spooky error message automatically provided
  console.error(getErrorMessage(error))
}
```

**Use streaming for chat responses:**

```typescript
import { sendChatMessageStream } from '@/lib/api-client'

await sendChatMessageStream(request, {
  onChunk: (chunk) => {
    // Update UI with each chunk
    setMessages(prev => updateLastMessage(prev, chunk))
  },
  onComplete: (fullText) => {
    // Response complete
    setIsLoading(false)
  },
  onError: (error) => {
    // Handle error
    showErrorMessage(getErrorMessage(error))
  }
})
```

**Add retry logic:**

```typescript
import { withRetry, scanVault } from '@/lib/api-client'

// Automatically retry failed requests
const files = await withRetry(
  () => scanVault(vaultPath),
  3, // max retries
  1000 // initial delay (ms)
)
```

**Deduplicate concurrent requests:**

```typescript
import { deduplicateRequest, readFile } from '@/lib/api-client'

// Multiple components requesting same file will share one request
const file = await deduplicateRequest(
  `file-${fileId}`,
  () => readFile(fileId, vaultPath)
)
```

---

### 2. Error Boundary

**Wrap your app or components:**

```typescript
// app/layout.tsx
import ErrorBoundary from '@/lib/error-boundary'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Optional: Log to service
            console.error('Error caught:', error)
          }}
        >
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

**Use custom fallback UI:**

```typescript
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h1>Custom Error UI</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

**Throw errors from event handlers:**

```typescript
import { useErrorHandler } from '@/lib/error-boundary'

function MyComponent() {
  const throwError = useErrorHandler()

  const handleClick = async () => {
    try {
      await riskyOperation()
    } catch (error) {
      // This will be caught by error boundary
      throwError(error)
    }
  }
}
```

**Reset on dependency change:**

```typescript
<ErrorBoundary resetKeys={[userId, projectId]}>
  <UserProfile />
</ErrorBoundary>
```

---

### 3. ARIA Labels (Already Applied!)

All components now have proper accessibility. No additional work needed!

**What was added:**
- Search input: `aria-label`, `role="searchbox"`
- Filter buttons: `aria-pressed` states
- File cards: keyboard navigation, `aria-label`
- Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`
- Chat: `role="log"`, `aria-live="polite"`
- Stats: `role="status"` with descriptive labels

**Keyboard shortcuts that now work:**
- `Tab` - Navigate between elements
- `Enter/Space` - Activate buttons/cards
- `Escape` - Close modal
- `⌘K / Ctrl+K` - Focus search

---

### 4. Validation Script

**Run validation before demo:**

```bash
# Run the script
node scripts/validate-demo-vault.js

# Exit code 0 = all checks passed
# Exit code 1 = some checks failed
```

**What it checks:**
- ✅ 15 files exist
- ✅ 3 folders present
- ✅ Frontmatter structure (title, tags, date)
- ✅ Content quality (minimum length)
- ✅ File interconnections (wikilinks)
- ✅ Statistics summary

**Use in CI/CD:**

```json
// package.json
{
  "scripts": {
    "validate": "node scripts/validate-demo-vault.js",
    "pretest": "npm run validate"
  }
}
```

---

### 5. Testing Checklist

**Before demo, run through:**

```bash
# Open the checklist
cat TESTING_CHECKLIST.md

# Or open in your editor
code TESTING_CHECKLIST.md
```

**Key sections to check:**
1. ✅ Environment setup
2. ✅ Visual testing (desktop/tablet/mobile)
3. ✅ Functional testing (search, filters, chat)
4. ✅ Accessibility (keyboard, screen reader)
5. ✅ Performance (load time, scrolling)
6. ✅ Browser compatibility
7. ✅ Demo script rehearsal

---

## 🎯 Common Use Cases

### Use Case 1: Add Retry to API Call

```typescript
import { withRetry, scanVault } from '@/lib/api-client'

const files = await withRetry(
  () => scanVault(vaultPath),
  3 // retry up to 3 times
)
```

### Use Case 2: Handle Streaming Chat

```typescript
import { sendChatMessageStream } from '@/lib/api-client'

const [response, setResponse] = useState('')

await sendChatMessageStream(request, {
  onChunk: (chunk) => setResponse(prev => prev + chunk),
  onError: (error) => alert(getErrorMessage(error))
})
```

### Use Case 3: Catch Component Errors

```typescript
import ErrorBoundary from '@/lib/error-boundary'

<ErrorBoundary>
  <UnstableComponent />
</ErrorBoundary>
```

### Use Case 4: Validate Before Deploy

```bash
# Add to your CI pipeline
npm run validate
npm run build
npm run test
```

### Use Case 5: Pre-Demo Check

```bash
# 5 minutes before demo
node scripts/validate-demo-vault.js
npm run dev
# Open localhost:3000
# Run through TESTING_CHECKLIST.md
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/lib/api-client'"

Make sure you're importing from the correct path:

```typescript
// ✅ Correct
import { sendChatMessage } from '@/lib/api-client'

// ❌ Wrong
import { sendChatMessage } from './lib/api-client'
import { sendChatMessage } from '@/lib/api/client' // old path
```

### Validation Script Fails

Check that demo-vault exists:

```bash
ls demo-vault/
# Should show: feedback/ product-logs/ random-notes/
```

### ARIA Labels Not Working

Clear browser cache and rebuild:

```bash
rm -rf .next
npm run dev
```

### TypeScript Errors

Ensure you're using the latest types:

```typescript
import type { ChatRequest, ChatResponse } from '@/lib/api/types'
```

---

## 📚 Full Documentation

For complete details, see:

- **API Client:** `/lib/api-client.ts` (inline comments)
- **Error Boundary:** `/lib/error-boundary.tsx` (inline comments)
- **Testing Guide:** `/TESTING_CHECKLIST.md`
- **Summary Report:** `/INTEGRATION_SUMMARY.md`

---

## 🎉 You're Ready!

All utilities are installed and components are enhanced. Key benefits:

✅ Production-ready error handling
✅ Advanced API features (retry, timeout, streaming)
✅ Full accessibility support
✅ Automated validation
✅ Comprehensive testing guide

**Start using these utilities now to make your app more robust!** 🎃👻
