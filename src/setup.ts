import { llmRegistry } from './core/llm-provider';
import { ClaudeProvider } from './providers/claude-provider';
import { MockProvider } from './providers/mock-provider';
// Import OpenAI provider when ready
// import { OpenAIProvider } from './providers/openai-provider';

export function initializeLLMProviders() {
  // Register mock provider (always available)
  llmRegistry.register(new MockProvider());
  
  // Register Claude provider if API key is available
  if (process.env.ANTHROPIC_API_KEY) {
    llmRegistry.register(new ClaudeProvider());
    console.log('✅ Claude provider registered');
  } else {
    console.log('⚠️  No ANTHROPIC_API_KEY found - Claude provider not available');
  }
  
  // Register OpenAI provider if API key is available
  if (process.env.OPENAI_API_KEY) {
    // llmRegistry.register(new OpenAIProvider());
    console.log('⚠️  OpenAI provider not yet implemented');
  }
  
  // Set default provider
  if (process.env.ANTHROPIC_API_KEY) {
    llmRegistry.setDefault('claude');
  } else {
    llmRegistry.setDefault('mock');
    console.log('ℹ️  Using mock provider by default');
  }
  
  console.log(`Available providers: ${llmRegistry.list().join(', ')}`);
}

// Environment setup helper
export function checkEnvironment(): boolean {
  const required = [];
  const optional = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY'];
  
  let hasIssues = false;
  
  // Check required variables
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`❌ Missing required environment variable: ${key}`);
      hasIssues = true;
    }
  }
  
  // Check optional variables
  const missingOptional = optional.filter(key => !process.env[key]);
  if (missingOptional.length > 0) {
    console.log(`ℹ️  Optional environment variables not set: ${missingOptional.join(', ')}`);
    console.log('   Some features may be limited.');
  }
  
  return !hasIssues;
}

// Cost estimation helper
export function estimateWorkflowCost(steps: number, tokensPerStep: number = 2000): number {
  // Rough estimate based on Claude 3.5 Sonnet pricing
  const inputTokens = steps * tokensPerStep;
  const outputTokens = steps * (tokensPerStep / 2); // Assume output is half of input
  
  const inputCost = (inputTokens / 1_000_000) * 3; // $3 per million
  const outputCost = (outputTokens / 1_000_000) * 15; // $15 per million
  
  return inputCost + outputCost;
}

export function formatCostEstimate(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 100).toFixed(2)}¢`;
  }
  return `$${cost.toFixed(2)}`;
}
