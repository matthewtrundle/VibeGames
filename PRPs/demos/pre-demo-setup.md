# 🎃 Pre-Demo Setup Checklist - The Headless Horseman's Quest

Complete this checklist 5-10 minutes before your demo to ensure everything runs smoothly.

**Demo Time:** [Fill in]
**Demo Location:** [Fill in]
**Presenter:** [Fill in]

---

## ⏰ Timeline

- **T-10 minutes:** Complete technical setup
- **T-5 minutes:** Final validation
- **T-2 minutes:** Mental preparation
- **T-0:** Showtime! 👻

---

## 🖥️ Technical Setup (T-10 minutes)

### 1. Environment Check
- [ ] **Open Terminal**
- [ ] **Navigate to project directory**
  ```bash
  cd /Users/matthewrundle/Documents/VibeGames
  ```
- [ ] **Verify `.env.local` exists and has API key**
  ```bash
  cat .env.local | grep ANTHROPIC_API_KEY
  ```
  Should show: `ANTHROPIC_API_KEY=sk-ant-...`

---

### 2. Start Development Server
- [ ] **Run dev server**
  ```bash
  npm run dev
  ```
- [ ] **Wait for "Ready" message**
  Should see: `✓ Ready in [X]ms`
  Should show: `○ Local:   http://localhost:3000`

- [ ] **Leave terminal open** (don't close!)

---

### 3. Validate Demo Vault
- [ ] **Run validation script** (in new terminal tab)
  ```bash
  node scripts/validate-demo-vault.js
  ```
- [ ] **Check output**
  - ✅ 15/15 files present
  - ✅ 0 critical errors
  - ⚠️ 15 missing title fields (expected, non-blocking)
  - ⚠️ 0 wikilinks (expected, non-blocking)

- [ ] **Verify file count in output**
  ```
  Total Files: 15
  Total Folders: 3
  Total Words: 2,098
  ```

---

### 4. Browser Setup
- [ ] **Open Chrome or Edge** (recommended)
- [ ] **Navigate to http://localhost:3000**
- [ ] **Verify page loads**
  - See "The Graveyard" header
  - See "15 scattered markdown files reunited"
  - See stats dashboard with metrics
  - See file grid with 15 cards

- [ ] **Open Developer Tools** (F12 or Cmd+Opt+I)
- [ ] **Check Console tab**
  - Should be clean (no red errors)
  - May see info logs (gray) - that's fine

- [ ] **Close DevTools for demo** (cleaner view)

---

### 5. Browser Configuration
- [ ] **Set zoom to 100%**
  - Chrome: Cmd+0 (Mac) or Ctrl+0 (Windows)
  - Verify zoom level in URL bar

- [ ] **Enter Full Screen mode**
  - Mac: Cmd+Ctrl+F
  - Windows: F11
  - Should see browser in full screen (no address bar)

- [ ] **Close all other tabs**
  - Only keep demo tab open
  - Reduces clutter and performance

- [ ] **Pin tab** (optional)
  - Right-click tab → Pin Tab
  - Prevents accidental close

---

### 6. Display Settings
- [ ] **Close notifications**
  - Mac: Cmd+Shift+D (Do Not Disturb)
  - Windows: Win+N (Notification center → Focus Assist)

- [ ] **Hide desktop icons** (optional)
  - Mac: Defaults doesn't matter for browser demo
  - Windows: Right-click desktop → View → Show desktop icons

- [ ] **Close other apps**
  - Quit Slack, Mail, Messages
  - Keep Terminal running
  - Keep Browser running
  - Everything else closed

- [ ] **Disable screen saver/sleep**
  - Mac: System Preferences → Energy Saver → Prevent sleep
  - Windows: Settings → System → Power → Never

---

## ✅ Functional Validation (T-5 minutes)

### 7. Test File Discovery
- [ ] **Verify stats dashboard shows:**
  - Total Files: 15
  - Unique Tags: [Number shown]
  - Total Words: 2,098
  - Avg Words/File: 140

- [ ] **Verify folder breakdown shows:**
  - product-logs
  - feedback
  - random-notes
  - Progress bars animated

---

### 8. Test Search Functionality
- [ ] **Type "bug" in search bar**
- [ ] **Verify filtering works**
  - Should show ~3 files
  - Cards filter in real-time
  - "Showing X of 15 files" updates

- [ ] **Clear search** (click X or delete text)
- [ ] **Verify all 15 files return**

---

### 9. Test Folder Filtering
- [ ] **Click "product-logs" filter**
  - Should show 5 files
  - Button highlighted in orange

- [ ] **Click "feedback" filter**
  - Should show 5 files
  - Previous filter deselected

- [ ] **Click "All Files" filter**
  - Should show all 15 files
  - All filters deselected

---

### 10. Test File Modal
- [ ] **Click any file card**
- [ ] **Modal should open with:**
  - Smooth fade-in animation
  - Backdrop blur
  - File title at top
  - Folder badge
  - Markdown content rendered
  - Headings, lists, formatting

- [ ] **Test modal close:**
  - Click X button (top right) → Should close
  - Click backdrop (outside modal) → Should close
  - Press Escape key → Should close
  - Click "Close" button (bottom) → Should close

- [ ] **Verify animation smooth**

---

### 11. Test AI Chat Interface
- [ ] **Scroll to AI Spirit Medium section**
- [ ] **Verify example questions visible:**
  1. "What bugs are mentioned?"
  2. "Summarize user feedback"
  3. "What features are users requesting?"

- [ ] **Send TEST query:** "What bugs are mentioned?"
  1. Type or click example question
  2. Hit Enter or click "Ask" button
  3. User message appears immediately
  4. Loading spinner appears with spooky message
  5. AI response streams in (should take 5-15 seconds)
  6. Response completes with markdown formatting
  7. No error messages

- [ ] **Verify response quality:**
  - Mentions 2-3 bugs (mobile crashes, UI issues, performance)
  - Coherent summary
  - May reference file names
  - Markdown formatted (headings, lists, bold)

- [ ] **If TEST query fails:**
  - ❌ Stop setup
  - ❌ Check API key
  - ❌ Check network connection
  - ❌ Check console for errors
  - ❌ Don't proceed until working

---

### 12. Keyboard Navigation Test
- [ ] **Press Tab key multiple times**
  - Focus should move logically
  - Orange focus ring visible
  - Search → Filters → File cards → Chat input

- [ ] **Press Cmd+K (Mac) or Ctrl+K (Windows)**
  - Search bar should focus
  - Ready to type

- [ ] **Tab to a file card, press Enter**
  - Modal should open

- [ ] **Press Escape**
  - Modal should close

---

## 🎯 Demo Prep (T-2 minutes)

### 13. Reset Demo State
- [ ] **Refresh page** (Cmd+R or Ctrl+R)
- [ ] **Wait for full reload**
- [ ] **Verify clean state:**
  - All 15 files visible
  - No search query
  - "All Files" filter selected
  - Chat is empty (shows example questions)
  - No modals open

- [ ] **Clear browser console** (in DevTools, if open)
  - Right-click console → Clear console
  - Or Cmd+K (Mac) / Ctrl+L (Windows)

---

### 14. Position Browser Window
- [ ] **Enter/verify full screen**
- [ ] **Scroll to top of page**
  - See "The Graveyard" header
  - Stats dashboard fully visible

- [ ] **Cursor at neutral position**
  - Not hovering over any elements
  - In center of screen area

---

### 15. Presenter Setup
- [ ] **Demo script open** (printed or on second screen)
  - File: `PRPs/demos/demo-script.md`
  - Can glance at for timing

- [ ] **Demo queries memorized** (don't need to read)
  1. "What bugs are mentioned?"
  2. "Summarize user feedback"
  3. "What features are users requesting?"

- [ ] **Backup queries ready** (if needed)
  - Fallback: "What files mention bugs?"
  - Fallback: "Summarize the mobile bug report"

---

### 16. Mental Preparation
- [ ] **Take 3 deep breaths** 🧘
- [ ] **Review opening line:**
  > "Ever lost your head looking for information across scattered markdown files?"

- [ ] **Visualize successful demo:**
  - Smooth interactions
  - AI responds quickly
  - Judges engaged and impressed

- [ ] **Remember your differentiator:**
  - **12 parallel AI agents!**
  - This is your unique story
  - Lead with it, close with it

---

## 🚀 Final Checks (T-1 minute)

### 17. Quick Visual Scan
- [ ] **Screen is clean**
  - No visible terminal windows
  - No dock showing (if Mac full screen)
  - No taskbar showing (if Windows full screen)
  - Only browser visible

- [ ] **Browser looks good**
  - Full screen
  - Page loaded
  - No error messages visible
  - Stats show correct numbers

- [ ] **You look good**
  - Standing confidently (if standing)
  - Hands free to gesture
  - Can see screen clearly
  - Can reach keyboard/mouse easily

---

### 18. Tech Double-Check
- [ ] **WiFi/Network connected** (check status icon)
- [ ] **Terminal still running** (peek at terminal window)
  - Should show "Ready" message
  - No error messages

- [ ] **Battery charged** (if laptop)
  - Plugged in recommended
  - At least 50% if not

- [ ] **Volume muted** (prevent notification sounds)
  - Or very low
  - No sudden beeps

---

### 19. Backup Plan Ready
- [ ] **Know your fallbacks:**
  - If AI fails → Retry once, then use fallback query
  - If search fails → Use folder filters
  - If modal fails → Describe feature verbally
  - If total failure → Have screenshots ready?

- [ ] **Confidence check:**
  - You've tested everything
  - You know the script
  - You're ready to adapt
  - You've got this! 💪

---

## 🎬 Go Time! (T-0)

### 20. Pre-Demo Ritual
- [ ] **Smile** 😊
- [ ] **Stand tall** (if standing)
- [ ] **Make eye contact** with judges/audience
- [ ] **Take one more breath** 🧘

---

### 21. Opening Move
- [ ] **Wait for signal to begin**
- [ ] **Start with energy:**
  > "Ever lost your head looking for information across scattered markdown files?"

- [ ] **Show the screen:**
  - Gesture to dashboard
  - Point to 15 files

- [ ] **Launch into demo!** 🚀

---

## ✅ Setup Completion Checklist

**Sign off on these before proceeding:**

- [x] Server running on localhost:3000
- [x] Demo vault validated (15 files)
- [x] Browser configured (full screen, 100% zoom)
- [x] Search tested and working
- [x] Folder filters tested and working
- [x] File modal tested and working
- [x] AI chat tested with one query (CRITICAL!)
- [x] Keyboard navigation tested
- [x] Page refreshed to clean state
- [x] Console cleared (no errors)
- [x] Notifications disabled
- [x] Other apps closed
- [x] Demo script reviewed
- [x] Queries memorized
- [x] Backup plans known
- [x] Mentally prepared
- [x] Confidence level: HIGH! 🎯

**Total Time:** ~8-10 minutes
**Status:** READY FOR DEMO! 👻🎃

---

## 📝 Post-Demo Debrief

**After the demo, note:**

- [ ] What went well
- [ ] What could improve
- [ ] Any unexpected issues
- [ ] Judge questions
- [ ] Audience reactions
- [ ] Ideas for next time

---

## 🆘 Emergency Contacts

**If total technical failure:**
- Terminal crashed → Restart server (npm run dev)
- Browser crashed → Reopen localhost:3000
- Network down → Use phone hotspot
- API key invalid → Check .env.local
- Everything on fire → Take deep breath, explain concept verbally

---

## 🎃 Final Words

You've built something amazing with 12 parallel AI agents. You've tested everything. You know your script. You're ready.

**Now go reunite some scattered thoughts and blow their minds!** 👻⚡

**May the Headless Horseman guide your demo to victory!** 🏆🎃

---

**Setup Complete:** [Your Name] ✅
**Date/Time:** [Fill in]
**Ready to Demo:** YES! 🚀
