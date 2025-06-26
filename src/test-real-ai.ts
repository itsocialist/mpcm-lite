#!/usr/bin/env node
import { config } from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';
import { LLMProviderFactory } from './core/llm-provider';
import { Orchestrator } from './core/orchestrator-v2';
import { MarketplaceRegistry } from './core/marketplace-roles';

config();

async function testRealAI() {
  console.log(chalk.bold.cyan('\n🚀 MPCM-Pro Real AI Test\n'));
  
  // Check API key
  if (!process.env.LLM_API_KEY || process.env.LLM_API_KEY === 'your-api-key-here') {
    console.log(chalk.red('❌ Please set your LLM_API_KEY in .env file'));
    console.log(chalk.yellow('Copy .env.example to .env and add your API key'));
    process.exit(1);
  }
  
  try {
    // Initialize components
    const spinner = ora('Initializing AI orchestrator...').start();
    const llmProvider = LLMProviderFactory.create(
      process.env.LLM_PROVIDER as 'claude' | 'gpt' || 'claude',
      process.env.LLM_API_KEY
    );
    
    const marketplace = new MarketplaceRegistry();
    const orchestrator = new Orchestrator(llmProvider, marketplace);
    spinner.succeed('AI orchestrator ready!');
    
    // Test simple app
    console.log(chalk.bold('\n📱 Building: Simple Todo App\n'));
    
    const buildSpinner = ora('AI team is working...').start();
    const result = await orchestrator.buildApp(
      'Build a simple todo app with add, delete, and mark complete features',
      { useMarketplace: false }
    );
    
    if (result.status === 'success') {
      buildSpinner.succeed('App built successfully!');
      console.log(chalk.green('\n✅ ' + result.summary));
      console.log(chalk.cyan(`\n💻 To run your app:`));
      console.log(chalk.white(`   cd output/${result.projectId}`));
      console.log(chalk.white(`   npm install`));
      console.log(chalk.white(`   npm run dev`));
    } else {
      buildSpinner.fail('Build failed');
      console.log(chalk.red(result.message));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    console.log(chalk.yellow('\nTroubleshooting:'));
    console.log('1. Check your API key is valid');
    console.log('2. Check you have internet connection');
    console.log('3. Check your LLM provider has credits');
  }
}

// Run test
testRealAI();
