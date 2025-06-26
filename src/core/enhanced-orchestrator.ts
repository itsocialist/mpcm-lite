import { WorkflowStep, WorkflowContext } from '../types';
import { RoleRegistry } from './role-registry';
import { llmRegistry, costTracker, LLMProvider } from './llm-provider';
import ora from 'ora';
import chalk from 'chalk';

export interface OrchestratorConfig {
  provider?: string;
  verbose?: boolean;
  maxCost?: number;
  streamOutput?: boolean;
}

export class EnhancedOrchestrator {
  private roleRegistry: RoleRegistry;
  private config: OrchestratorConfig;
  private llmProvider: LLMProvider;
  
  constructor(config: OrchestratorConfig = {}) {
    this.roleRegistry = new RoleRegistry();
    this.config = config;
    this.llmProvider = llmRegistry.get(config.provider);
  }
  
  async runWorkflow(steps: WorkflowStep[]): Promise<WorkflowContext> {
    const context: WorkflowContext = {};
    
    console.log(chalk.bold.cyan('\n🚀 Starting MPCM-Pro Orchestration\n'));
    
    for (const step of steps) {
      const spinner = ora({
        text: `${step.role}: Processing...`,
        color: 'cyan'
      }).start();
      
      try {
        // Check cost limit
        if (this.config.maxCost && costTracker.getTotalCost() > this.config.maxCost) {
          throw new Error(`Cost limit exceeded: $${costTracker.getTotalCost().toFixed(4)} > $${this.config.maxCost}`);
        }
        
        const role = await this.roleRegistry.getRole(step.role);
        
        // Process input with context
        const processedInput = this.processInput(step.input, context);
        
        // Execute role with LLM
        const output = await this.executeRoleWithLLM(role, processedInput, context);
        
        // Store output
        context[step.outputKey] = output;
        
        spinner.succeed(`${step.role}: Complete`);
        
        if (this.config.verbose) {
          console.log(chalk.gray(`  Cost: $${costTracker.getCostByPurpose(step.role).toFixed(4)}`));
        }
        
      } catch (error: any) {
        spinner.fail(`${step.role}: Failed`);
        console.error(chalk.red(`  Error: ${error.message}`));
        throw error;
      }
    }
    
    // Show cost summary
    console.log(chalk.bold.green('\n✅ Orchestration Complete!\n'));
    console.log(chalk.gray(costTracker.getReport()));
    
    return context;
  }
  
  private async executeRoleWithLLM(role: any, input: any, context: WorkflowContext): Promise<any> {
    // Build messages for LLM
    const messages = [
      {
        role: 'system' as const,
        content: role.getSystemPrompt()
      },
      {
        role: 'user' as const,
        content: this.formatInput(input, context)
      }
    ];
    
    if (this.config.streamOutput) {
      // Stream the response
      let fullResponse = '';
      const stream = this.llmProvider.stream(messages, {
        temperature: role.temperature || 0.7,
        maxTokens: role.maxTokens || 4096,
        systemPrompt: role.name
      });
      
      for await (const chunk of stream) {
        fullResponse += chunk.content;
        if (this.config.verbose) {
          process.stdout.write(chunk.content);
        }
      }
      
      return role.parseOutput(fullResponse);
    } else {
      // Get complete response
      const completion = await this.llmProvider.complete(messages, {
        temperature: role.temperature || 0.7,
        maxTokens: role.maxTokens || 4096,
        systemPrompt: role.name
      });
      
      return role.parseOutput(completion.content);
    }
  }
  
  private formatInput(input: any, context: WorkflowContext): string {
    if (typeof input === 'string') {
      return input;
    }
    
    // Format structured input as clear instructions
    let formatted = 'Please process the following:\n\n';
    
    for (const [key, value] of Object.entries(input)) {
      formatted += `${key}:\n${JSON.stringify(value, null, 2)}\n\n`;
    }
    
    // Add relevant context
    if (Object.keys(context).length > 0) {
      formatted += '\nContext from previous steps:\n';
      for (const [key, value] of Object.entries(context)) {
        if (typeof value === 'string' && value.length < 1000) {
          formatted += `\n${key}:\n${value}\n`;
        } else {
          formatted += `\n${key}: [${typeof value}]\n`;
        }
      }
    }
    
    return formatted;
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
  
  // Utility methods
  getCostReport(): string {
    return costTracker.getReport();
  }
  
  getTotalCost(): number {
    return costTracker.getTotalCost();
  }
  
  setProvider(provider: string): void {
    this.llmProvider = llmRegistry.get(provider);
  }
}

// Export for backward compatibility
export const Orchestrator = EnhancedOrchestrator;
