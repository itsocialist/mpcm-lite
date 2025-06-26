import { Role, RoleExecution, WorkflowContext } from '../types';

export abstract class BaseRole implements Role, RoleExecution {
  abstract id: string;
  abstract name: string;
  abstract systemPrompt: string;
  
  // LLM configuration
  temperature: number = 0.7;
  maxTokens: number = 4096;
  
  // Optional properties
  encrypted?: boolean;
  price?: number;
  
  /**
   * Get the full system prompt for this role
   */
  getSystemPrompt(): string {
    return `You are a ${this.name} working as part of an AI development team.

${this.systemPrompt}

Guidelines:
- Be concise and focused on your specific role
- Output should be well-structured and ready for the next role
- Follow best practices for your domain
- Consider the context from previous steps
- Produce production-ready output`;
  }
  
  /**
   * Execute the role with given input and context
   */
  abstract execute(input: any, context: WorkflowContext): Promise<any>;
  
  /**
   * Parse LLM output into structured format
   * Override this in subclasses for custom parsing
   */
  parseOutput(llmResponse: string): any {
    // Try to parse as JSON first
    try {
      return JSON.parse(llmResponse);
    } catch {
      // Return as plain text if not JSON
      return llmResponse;
    }
  }
  
  /**
   * Format context for inclusion in prompts
   */
  protected formatContext(context: WorkflowContext): string {
    let formatted = '';
    
    for (const [key, value] of Object.entries(context)) {
      if (value && typeof value === 'object') {
        formatted += `\n${key}:\n${JSON.stringify(value, null, 2)}\n`;
      } else if (value) {
        formatted += `\n${key}: ${value}\n`;
      }
    }
    
    return formatted;
  }
  
  /**
   * Extract relevant context for this role
   */
  protected getRelevantContext(context: WorkflowContext): Partial<WorkflowContext> {
    // Override in subclasses to filter context
    return context;
  }
}
