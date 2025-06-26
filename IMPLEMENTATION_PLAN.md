# MPCM-POC-Spike: 48-Hour Implementation Plan

## Goal: Demonstrate AI Team Building a Todo App with Payments

### Hour 0-4: Foundation
- [x] Project setup
- [ ] Basic orchestrator that chains LLM calls
- [ ] Three base role definitions (PM, Frontend, Backend)
- [ ] Simple workflow executor

### Hour 4-8: Role Implementation
- [ ] Product Manager role (creates requirements from user input)
- [ ] Frontend Developer role (generates React components)
- [ ] Backend Developer role (creates API routes)
- [ ] Basic context passing between roles

### Hour 8-12: Marketplace MVP
- [ ] Create Stripe Expert role with payment integration knowledge
- [ ] Implement basic encryption/decryption
- [ ] Purchase simulation (enter license key)
- [ ] Show locked vs unlocked functionality

### Hour 12-16: App Generation
- [ ] Template system for Next.js app
- [ ] Code generation from role outputs
- [ ] File writing to create actual app
- [ ] Basic app that runs locally

### Hour 16-20: Polish & Demo
- [ ] CLI with nice output (colors, spinners)
- [ ] Error handling
- [ ] Generated app includes Stripe checkout
- [ ] README and demo video

## Success Criteria
1. ✅ User types: "Build a todo app with payments"
2. ✅ System shows PM → Frontend → Backend workflow
3. ✅ System prompts: "Unlock Stripe Expert for $29?"
4. ✅ After "purchase", generates todo app with Stripe
5. ✅ App actually runs with `npm start`

## What We're NOT Building (Scope Control)
- ❌ Real MCP integration
- ❌ SQLite database
- ❌ Service registry
- ❌ Binary compilation
- ❌ Auto-updates
- ❌ Multi-project support
- ❌ Real payment processing
- ❌ Claude Code integration

## Key Files to Create

### 1. src/orchestrator.ts
```typescript
interface Role {
  name: string;
  systemPrompt: string;
  execute(input: any, context: any): Promise<any>;
}

class Orchestrator {
  async runWorkflow(workflow: WorkflowStep[]): Promise<AppOutput> {
    // Chain role executions
  }
}
```

### 2. src/marketplace.ts
```typescript
class Marketplace {
  async purchaseRole(roleId: string, licenseKey: string): Promise<Role> {
    // Decrypt role if license valid
  }
}
```

### 3. src/demo-app.ts
```typescript
// CLI that ties it all together
async function buildApp(idea: string) {
  // 1. Run base workflow
  // 2. Offer marketplace upgrade
  // 3. Generate final app
}
```

## Fastest Path Forward
1. Start with hardcoded workflow
2. Add LLM integration
3. Add marketplace encryption
4. Polish CLI output
5. Record demo video

This POC proves the concept without getting bogged down in infrastructure!
