#!/usr/bin/env node

import { EnhancedOrchestrator } from './core/enhanced-orchestrator';
import { initializeLLMProviders, checkEnvironment, estimateWorkflowCost, formatCostEstimate } from './setup';
import { WorkflowStep } from './types';
import chalk from 'chalk';
import inquirer from 'inquirer';

async function main() {
  console.log(chalk.bold.blue(`
╔═══════════════════════════════════════╗
║      MPCM-Pro LLM Demo v1.0          ║
║   Your AI Dev Team - Real Edition    ║
╚═══════════════════════════════════════╝
  `));
  
  // Check environment
  if (!checkEnvironment()) {
    console.log(chalk.yellow('\n⚠️  Some features may be limited without API keys.'));
  }
  
  // Initialize providers
  initializeLLMProviders();
  
  // Get user input
  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select LLM provider:',
      choices: [
        { name: 'Mock (Free - For Testing)', value: 'mock' },
        { name: 'Claude 3.5 Sonnet (Requires API Key)', value: 'claude' },
        // { name: 'GPT-4 (Requires API Key)', value: 'openai' }
      ]
    }
  ]);
  
  if (provider !== 'mock' && !process.env.ANTHROPIC_API_KEY) {
    console.log(chalk.red('\n❌ API key required for Claude provider.'));
    console.log(chalk.yellow('Please set ANTHROPIC_API_KEY environment variable.'));
    process.exit(1);
  }
  
  const { projectIdea } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectIdea',
      message: 'Describe your app idea:',
      default: 'A todo app with user authentication and Stripe payments'
    }
  ]);
  
  // Estimate cost
  const estimatedCost = provider === 'mock' ? 0 : estimateWorkflowCost(3);
  console.log(chalk.gray(`\nEstimated cost: ${formatCostEstimate(estimatedCost)}`));
  
  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Proceed with app generation?',
      default: true
    }
  ]);
  
  if (!proceed) {
    console.log(chalk.yellow('\nGeneration cancelled.'));
    process.exit(0);
  }
  
  // Define workflow
  const workflow: WorkflowStep[] = [
    {
      role: 'product-manager',
      input: projectIdea,
      outputKey: 'requirements'
    },
    {
      role: 'frontend-developer',
      input: { requirements: '{{requirements}}' },
      outputKey: 'frontend'
    },
    {
      role: 'backend-developer',
      input: { requirements: '{{requirements}}' },
      outputKey: 'backend'
    }
  ];
  
  // Create orchestrator
  const orchestrator = new EnhancedOrchestrator({
    provider,
    verbose: true,
    maxCost: 10, // $10 limit
    streamOutput: false
  });
  
  try {
    console.log(chalk.cyan('\n🚀 Starting app generation...\n'));
    
    const startTime = Date.now();
    const result = await orchestrator.runWorkflow(workflow);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Display results
    console.log(chalk.bold.green(`\n✨ App generated successfully in ${duration}s!\n`));
    
    if (result.requirements) {
      console.log(chalk.bold('📋 Requirements:'));
      console.log(chalk.gray(JSON.stringify(result.requirements, null, 2).slice(0, 500) + '...'));
    }
    
    console.log(chalk.bold(`\n💰 Total Cost: ${formatCostEstimate(orchestrator.getTotalCost())}`));
    
    if (provider === 'mock') {
      console.log(chalk.yellow('\n⚠️  This was a mock run. Set up API keys for real AI generation.'));
    }
    
  } catch (error: any) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

// Run the demo
main().catch(console.error);
