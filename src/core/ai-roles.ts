import { LLMProvider } from './llm-provider';

export interface RoleContext {
  projectDescription: string;
  previousDecisions: string[];
  currentPhase: string;
  constraints: string[];
}

export interface RoleResult {
  output: string;
  nextSteps: string[];
  dependencies: string[];
  cost: number;
}

export abstract class AIRole {
  constructor(
    protected name: string,
    protected llmProvider: LLMProvider
  ) {}
  
  abstract getSystemPrompt(): string;
  abstract execute(task: string, context: RoleContext): Promise<RoleResult>;
  
  protected async callLLM(prompt: string): Promise<{ content: string; cost: number }> {
    const result = await this.llmProvider.complete(prompt, this.getSystemPrompt());
    return {
      content: result.content,
      cost: result.usage.totalCost
    };
  }
}

export class ProductManagerRole extends AIRole {
  getSystemPrompt(): string {
    return `You are an expert Product Manager for a web application development team.
Your role is to analyze user requirements and create clear, actionable specifications.

Output Format:
1. Core Requirements (what the app MUST do)
2. User Stories (who uses it and why)
3. Technical Constraints
4. Success Metrics
5. Recommended Tech Stack

Be specific, practical, and focused on quick delivery.`;
  }
  
  async execute(task: string, context: RoleContext): Promise<RoleResult> {
    const prompt = `
Project Request: "${context.projectDescription}"

Analyze this request and create a product specification that can be implemented quickly.
Focus on MVP features that deliver immediate value.
`;
    
    const { content, cost } = await this.callLLM(prompt);
    
    // Parse structured output
    const sections = this.parseOutput(content);
    
    return {
      output: content,
      nextSteps: ['frontend_design', 'backend_architecture'],
      dependencies: [],
      cost
    };
  }
  
  private parseOutput(content: string): any {
    // Simple parsing - in production would be more robust
    return {
      requirements: content.match(/Core Requirements:(.*?)User Stories:/s)?.[1]?.trim() || '',
      userStories: content.match(/User Stories:(.*?)Technical Constraints:/s)?.[1]?.trim() || '',
      techStack: content.match(/Recommended Tech Stack:(.*?)$/s)?.[1]?.trim() || ''
    };
  }
}

export class FrontendDeveloperRole extends AIRole {
  getSystemPrompt(): string {
    return `You are an expert Frontend Developer specializing in React and Next.js.
You write clean, modern TypeScript code with excellent UI/UX.

When given requirements, you create:
1. Component structure
2. Complete React component code
3. Tailwind CSS styling
4. Type definitions
5. Basic responsiveness

Output actual, working code - not placeholders or snippets.`;
  }
  
  async execute(task: string, context: RoleContext): Promise<RoleResult> {
    const prompt = `
Requirements: ${task}

Create the complete frontend implementation for these requirements.
Use Next.js 14 with App Router, TypeScript, and Tailwind CSS.
Output the actual component code files.
`;
    
    const { content, cost } = await this.callLLM(prompt);
    
    return {
      output: content,
      nextSteps: ['integrate_api'],
      dependencies: ['api_endpoints'],
      cost
    };
  }
}

export class BackendDeveloperRole extends AIRole {
  getSystemPrompt(): string {
    return `You are an expert Backend Developer specializing in Node.js and API design.
You create robust, scalable APIs with proper error handling.

When given requirements, you create:
1. API endpoint structure
2. Complete route implementations
3. Data models
4. Validation logic
5. Error handling

Use Next.js API routes. Output actual, working code.`;
  }
  
  async execute(task: string, context: RoleContext): Promise<RoleResult> {
    const prompt = `
Requirements: ${task}

Create the complete backend implementation for these requirements.
Use Next.js API routes with TypeScript.
Include proper validation and error handling.
`;
    
    const { content, cost } = await this.callLLM(prompt);
    
    return {
      output: content,
      nextSteps: ['test_api', 'deploy'],
      dependencies: ['database_schema'],
      cost
    };
  }
}