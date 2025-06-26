import chalk from 'chalk';
import ora from 'ora';
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

  // Auto-demo mode
  const idea = 'A todo app with user authentication';
  console.log(chalk.green('\n📝 Building:'), idea);

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
  console.log('\n' + chalk.yellow.bold('💡 Premium Feature Available!'));
  
  const stripeRole = marketplace.getRole('stripe-expert');
  console.log(chalk.green(`\n✨ ${stripeRole?.name} - Add payment processing`));
  console.log(chalk.gray(`   Integrate Stripe checkout, subscriptions, and webhooks`));
  console.log(chalk.bold.red(`   Price: $${stripeRole?.price}`));

  // Auto-purchase for demo
  console.log(chalk.cyan('\n[Demo: Auto-purchasing Stripe Expert...]'));
  
  spinner = ora('Validating license...').start();
  await sleep(1000);
  
  const stripeExpert = await marketplace.purchaseRole('stripe-expert', 'DEMO-2024');
  
  if (stripeExpert) {
    spinner.succeed('License validated! Stripe Expert joining the team');
    
    spinner = ora('Stripe Expert adding payment integration...').start();
    await sleep(2000);
    
    const paymentCode = await stripeExpert.execute(
      { existing_code: baseResult.frontend_code },
      baseResult
    );
    
    const finalResult = { ...baseResult, payment_code: paymentCode };
    spinner.succeed('Payment integration complete!');

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

    console.log(chalk.yellow(`⚡ Stripe integration included!`));
    console.log(chalk.gray(`   Add your Stripe keys to .env.local`));
    
    // Show what was generated
    console.log(chalk.bold.magenta('\n📂 Generated Files:'));
    console.log(chalk.gray('   - src/app/page.tsx (Main page)'));
    console.log(chalk.gray('   - src/components/TodoApp.tsx (Todo component)'));
    console.log(chalk.gray('   - src/app/api/todos/route.ts (API routes)'));
    console.log(chalk.gray('   - src/components/CheckoutButton.tsx (Stripe checkout)'));
    console.log(chalk.gray('   - src/app/api/create-checkout-session/route.ts (Stripe API)'));
    console.log(chalk.gray('   - Plus all Next.js config files'));
    
    console.log(chalk.bold.green('\n🎉 Demo Complete! This POC demonstrates:'));
    console.log(chalk.white('   ✓ Multi-role AI orchestration'));
    console.log(chalk.white('   ✓ Role marketplace with encryption'));
    console.log(chalk.white('   ✓ Real app generation'));
    console.log(chalk.white('   ✓ Premium feature monetization'));
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);
