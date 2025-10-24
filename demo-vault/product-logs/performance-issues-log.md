---
tags: [performance, optimization, bug]
date: 2024-10-18
severity: medium
---

# Performance Issues Log

## Dashboard Load Times
- Current: 3-5 seconds on mobile
- Target: < 1 second
- Issue: Unoptimized file loading, no lazy loading

## Memory Leaks
Suspected memory leak in file rendering component. Files aren't being garbage collected properly after viewing.

## Related Issues
- Mobile crashes (bug-report-mobile-crashes.md) may be related
- UI flickering (bug-report-haunted-ui.md) could be performance-related
- Users complaining about slow app (user-complaints-sept.md)

## Optimization Ideas
- Implement lazy loading for file list
- Add virtual scrolling for large vaults
- Optimize markdown rendering
- Cache file previews
