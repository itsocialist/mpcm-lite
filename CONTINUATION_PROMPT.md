# MPCM-POC-SPIKE Continuation Prompt

## PROJECT CONTEXT: POC SPIKE - NOT PRODUCTION

This is **mpcm-poc-spike** - a quick and dirty proof of concept to demonstrate AI orchestration.
- **Goal**: Make it WORK, not make it perfect
- **Approach**: Simplest path to demo value
- **Timeline**: Hours, not weeks
- **Quality**: "It runs" > "It's elegant"

## Current Reality Check

### What Exists
- Complex architecture files (overengineered)
- TypeScript errors everywhere
- Untested code that doesn't run
- An .env file with working Anthropic API key

### What We Actually Need
- ONE working demo that chains AI calls
- Simple file output (no fancy parsing)
- Basic marketplace concept (can be mocked)
- Something that RUNS in < 1 hour

### The Problem
The previous attempt created enterprise architecture for a spike. Too many abstractions, too much complexity, nothing actually works.

### For Next Session

Start with:
```
Continue the mpcm-poc-spike project. 

CONTEXT: This is a SPIKE, not production. The previous implementation is overengineered and doesn't run. I need something that WORKS in the next hour.

Requirements:
1. Strip down to bare minimum
2. Make ONE flow work: Description → PM → Frontend → Output
3. Use the Anthropic key in .env
4. Output can be console logs - just prove AI orchestration works
5. Skip TypeScript if needed - JavaScript is fine
6. One hardcoded "Stripe Expert" to show marketplace concept

The motto: "Make it run, make it right, make it fast" - and we're still on step 1.

Check /Users/briandawson/Development/mpcm-poc-spike
Anthropic API key is already in .env
```

## Key Point
This is a SPIKE to prove the concept works. Not a production system. The other team is stuck in analysis paralysis. We need working code, even if it's ugly.

## Success Criteria
- [ ] Can call real Claude API
- [ ] Can chain multiple AI calls
- [ ] Can show output in console
- [ ] Can suggest a marketplace role
- [ ] Takes < 1 hour to implement

Remember: Done is better than perfect for a spike!
