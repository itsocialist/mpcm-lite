import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { Orchestrator } from './core/orchestrator';
import { Marketplace } from './core/marketplace';
import { AppGenerator } from './core/app-generator';
import { WorkflowStep } from './types';

async function main() {
  console.clear();
  console.log(chalk.bold.cyan(`
╔═══════════════════════════════════════╗
║      MPCM-Pro POC - AI Dev Team       ║
║   Build Apps with Your AI Engineers   ║
╚═══════════════════════════════════════╝
  `));

  const { idea } = await prompts({
    type: 'text',
    name: 'idea',
    message: 'What would you like to build?',
    initial: 'A todo app with user authentication'
  });

  console.log('\n' + chalk.gray('Starting your AI development team...\n'));

  const orchestrator = new Orchestrator();
  const marketplace = new Marketplace();

  // Base workflow
  const workflow: WorkflowStep[] = [
    {
      role: 'product-manager',
      input: idea,
      outputKey: 'requirements'
    },
    {
      role: 'frontend-developer',
      input: { requirements: '{{requirements}}' },
      outputKey: 'frontend_code'
    },
    {
      role: 'backend-developer',
      input: { requirements: '{{requirements}}' },
      outputKey: 'backend_code'
    }
  ];

  // Execute base workflow with spinners
  let spinner = ora('Product Manager analyzing requirements...').start();
  await sleep(1500);
  spinner.succeed('Product Manager created requirements');

  spinner = ora('Frontend Developer building UI components...').start();
  await sleep(2000);
  spinner.succeed('Frontend Developer completed React components');

  spinner = ora('Backend Developer creating API...').start();
  await sleep(1500);
  spinner.succeed('Backend Developer implemented API routes');

  const baseResult = await orchestrator.runWorkflow(workflow);

  // Marketplace upsell
  console.log('\n' + chalk.yellow.bold('💡 Enhance your app with premium features!'));
  
  const stripeRole = marketplace.getRole('stripe-expert');
  console.log(chalk.green(`\n✨ ${stripeRole?.name} - Add payment processing`));
  console.log(chalk.gray(`   Integrate Stripe checkout, subscriptions, and webhooks`));
  console.log(chalk.bold.red(`   Price: $${stripeRole?.price}`));

  const { purchase } = await prompts({
    type: 'confirm',
    name: 'purchase',
    message: 'Would you like to add payment features?',
    initial: true
  });

  let finalResult = baseResult;

  if (purchase) {
    const { license } = await prompts({
      type: 'text',
      name: 'license',
      message: 'Enter license key:',
      initial: 'DEMO-2024'
    });

    spinner = ora('Validating license...').start();
    await sleep(1000);
    
    const stripeExpert = await marketplace.purchaseRole('stripe-expert', license);
    
    if (stripeExpert) {
      spinner.succeed('License validated! Stripe Expert joining the team');
      
      spinner = ora('Stripe Expert adding payment integration...').start();
      await sleep(2000);
      
      const paymentCode = await stripeExpert.execute(
        { existing_code: baseResult.frontend_code },
        baseResult
      );
      
      finalResult = { ...baseResult, payment_code: paymentCode };
      spinner.succeed('Payment integration complete!');
    } else {
      spinner.fail('Invalid license key');
    }
  }

  // Generate the app
  console.log('\n' + chalk.bold.cyan('🚀 Generating your application...\n'));
  
  const generator = new AppGenerator();
  const outputPath = await generator.generateApp(finalResult);
  
  console.log(chalk.green.bold(`\n✅ App generated successfully!\n`));
  console.log(chalk.white(`📁 Location: ${outputPath}`));
  console.log(chalk.gray(`\nTo run your app:`));
  console.log(chalk.cyan(`   cd ${outputPath}`));
  console.log(chalk.cyan(`   npm install`));
  console.log(chalk.cyan(`   npm run dev\n`));
  
  if (finalResult.payment_code) {
    console.log(chalk.yellow(`⚡ Stripe integration included!`));
    console.log(chalk.gray(`   Add your Stripe keys to .env.local`));
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);
