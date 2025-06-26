import { WorkflowStep, WorkflowContext } from '../types';
import { RoleRegistry } from './role-registry';

export class Orchestrator {
  private roleRegistry: RoleRegistry;
  
  constructor() {
    this.roleRegistry = new RoleRegistry();
  }
  
  async runWorkflow(steps: WorkflowStep[]): Promise<WorkflowContext> {
    const context: WorkflowContext = {};
    
    for (const step of steps) {
      const role = await this.roleRegistry.getRole(step.role);
      
      // Replace template variables in input
      const processedInput = this.processInput(step.input, context);
      
      // Execute role
      const output = await role.execute(processedInput, context);
      
      // Store output in context
      context[step.outputKey] = output;
    }
    
    return context;
  }
  
  private processInput(input: any, context: WorkflowContext): any {
    if (typeof input === 'string') {
      return this.replaceTemplates(input, context);
    }
    
    if (typeof input === 'object' && input !== null) {
      const processed: any = {};
      for (const [key, value] of Object.entries(input)) {
        processed[key] = this.processInput(value, context);
      }
      return processed;
    }
    
    return input;
  }
  
  private replaceTemplates(str: string, context: WorkflowContext): string {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }
}
