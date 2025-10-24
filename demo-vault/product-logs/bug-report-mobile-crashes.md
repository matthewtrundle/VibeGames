---
tags: [bug, mobile, critical]
date: 2024-10-21
severity: critical
---

# Mobile App Crashes on Startup

## Problem
The mobile app crashes immediately on startup for Android users running OS 12+. Affects approximately 30% of our user base.

## Error Logs
```
FATAL EXCEPTION: main
Process: com.headlesshorseman.app
java.lang.NullPointerException at MainActivity.onCreate()
```

## Impact
- 150+ crash reports in the last week
- 2-star reviews flooding in
- Users switching to competitors

## Next Steps
Need to prioritize this in sprint retrospective (see sprint-retrospective-oct.md)
