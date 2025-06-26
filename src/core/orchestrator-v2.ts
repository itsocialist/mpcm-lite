import { LLMProvider } from './llm-provider';
import { ProductManagerRole, FrontendDeveloperRole, BackendDeveloperRole, AIRole } from './ai-roles';
import { MarketplaceRegistry } from './marketplace-roles';
import { AppGenerator } from './app-generator';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface BuildOptions {
  useMarketplace?: boolean;
  streaming?: boolean;
}

export interface BuildResult {
  status: 'success' | 'marketplace_suggestion' | 'error';
  projectId?: string;
  summary?: string;
  deploymentUrl?: string;
  totalCost?: number;
  message?: string;
  suggestion?: {
    roleId: string;
    roleName: string;
    price: number;
    capabilities: string[];
  };
}

export interface ProjectProgress {
  projectId: string;
  percentage: number;
  currentStep: string;
  elapsed: number;
  steps: {
    name: string;
    status: 'pending' | 'running' | 'completed' | 'error';
    cost?: number;
  }[];
}

export class Orchestrator {
  private roles: Map<string, AIRole>;
  private projects: Map<string, ProjectProgress> = new Map();
  private appGenerator: AppGenerator;
  
  constructor(
    private llmProvider: LLMProvider,
    private marketplace: MarketplaceRegistry
  ) {
    // Initialize base roles
    this.roles = new Map([
      ['pm', new ProductManagerRole('pm', llmProvider)],
      ['frontend', new FrontendDeveloperRole('frontend', llmProvider)],
      ['backend', new BackendDeveloperRole('backend', llmProvider)],
    ]);
    
    this.appGenerator = new AppGenerator();
  }
  
  async buildApp(description: string, options: BuildOptions = {}): Promise<BuildResult> {
    const projectId = `project-${Date.now()}`;
    const startTime = Date.now();
    
    // Initialize progress tracking
    this.projects.set(projectId, {
      projectId,
      percentage: 0,
      currentStep: 'Starting',
      elapsed: 0,
      steps: [
        { name: 'Requirements Analysis', status: 'pending' },
        { name: 'Frontend Development', status: 'pending' },
        { name: 'Backend Development', status: 'pending' },
        { name: 'Integration', status: 'pending' },
        { name: 'Deployment', status: 'pending' },
      ],
    });
    
    try {
      let totalCost = 0;
      const context = {
        projectDescription: description,
        previousDecisions: [],
        currentPhase: 'planning',
        constraints: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
      };
      
      // Step 1: PM Analysis
      this.updateProgress(projectId, 0, 'Requirements Analysis', 'running');
      const pmResult = await this.roles.get('pm')!.execute(description, context);
      totalCost += pmResult.cost;
      context.previousDecisions.push(pmResult.output);
      this.updateProgress(projectId, 20, 'Requirements Analysis', 'completed', pmResult.cost);
      
      // Check if payments are needed
      const needsPayments = pmResult.output.toLowerCase().includes('payment') || 
                           description.toLowerCase().includes('payment') ||
                           description.toLowerCase().includes('stripe');
      
      if (needsPayments && options.useMarketplace) {
        const stripeRole = this.marketplace.getRole('stripe-expert');
        if (stripeRole && !this.marketplace.hasLicense(stripeRole.id, 'current-user')) {
          // Suggest marketplace role
          return {
            status: 'marketplace_suggestion',
            message: `I noticed your app needs payment processing. The ${stripeRole.name} role can add professional Stripe integration with:
• Secure checkout flow
• Subscription management
• Customer portal
• Automated invoicing
• Webhook handling

This premium role costs $${stripeRole.price} and will save hours of development time.`,
            suggestion: {
              roleId: stripeRole.id,
              roleName: stripeRole.name,
              price: stripeRole.price,
              capabilities: stripeRole.capabilities,
            },
          };
        }
      }
      
      // Step 2: Frontend Development
      this.updateProgress(projectId, 20, 'Frontend Development', 'running');
      context.currentPhase = 'frontend';
      const frontendResult = await this.roles.get('frontend')!.execute(
        pmResult.output,
        context
      );
      totalCost += frontendResult.cost;
      this.updateProgress(projectId, 40, 'Frontend Development', 'completed', frontendResult.cost);
      
      // Step 3: Backend Development
      this.updateProgress(projectId, 40, 'Backend Development', 'running');
      context.currentPhase = 'backend';
      const backendResult = await this.roles.get('backend')!.execute(
        pmResult.output,
        context
      );
      totalCost += backendResult.cost;
      this.updateProgress(projectId, 60, 'Backend Development', 'completed', backendResult.cost);
      
      // Step 4: Integration (with Stripe if licensed)
      this.updateProgress(projectId, 60, 'Integration', 'running');
      let stripeIntegration = '';
      
      if (needsPayments && this.marketplace.hasLicense('stripe-expert', 'current-user')) {
        const stripeRole = this.marketplace.createMarketplaceRole(
          this.marketplace.getRole('stripe-expert')!,
          this.llmProvider
        );
        const stripeResult = await stripeRole.execute(
          'Add Stripe payment integration',
          context
        );
        stripeIntegration = stripeResult.output;
        totalCost += stripeResult.cost;
      }
      
      this.updateProgress(projectId, 80, 'Integration', 'completed');
      
      // Step 5: Generate actual app files
      this.updateProgress(projectId, 80, 'Deployment', 'running');
      const appName = `app-${projectId}`;
      const outputPath = path.join(process.cwd(), 'output', appName);
      
      // Create app structure
      await this.appGenerator.generateApp({
        name: appName,
        path: outputPath,
        pmAnalysis: pmResult.output,
        frontendCode: frontendResult.output,
        backendCode: backendResult.output,
        stripeIntegration,
      });
      
      this.updateProgress(projectId, 100, 'Deployment', 'completed');
      
      // Calculate total time
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      
      return {
        status: 'success',
        projectId,
        summary: `Created ${appName} with:
• Requirements analysis by AI Product Manager
• Frontend built by AI Frontend Developer
• Backend API by AI Backend Developer
${stripeIntegration ? '• Professional Stripe integration' : ''}
• Ready for deployment

Total AI cost: $${totalCost.toFixed(2)}
Time: ${totalTime} seconds`,
        deploymentUrl: `http://localhost:3000`,
        totalCost,
      };
      
    } catch (error) {
      return {
        status: 'error',
        message: `Error building app: ${error.message}`,
      };
    }
  }
  
  private updateProgress(
    projectId: string,
    percentage: number,
    currentStep: string,
    stepStatus?: 'running' | 'completed' | 'error',
    stepCost?: number
  ): void {
    const progress = this.projects.get(projectId);
    if (!progress) return;
    
    progress.percentage = percentage;
    progress.currentStep = currentStep;
    progress.elapsed = Date.now() / 1000;
    
    // Update step status
    const step = progress.steps.find(s => s.name === currentStep);
    if (step && stepStatus) {
      step.status = stepStatus;
      if (stepCost) step.cost = stepCost;
    }
    
    // Mark next step as running if current is completed
    if (stepStatus === 'completed') {
      const currentIndex = progress.steps.findIndex(s => s.name === currentStep);
      if (currentIndex < progress.steps.length - 1) {
        progress.steps[currentIndex + 1].status = 'pending';
      }
    }
  }
  
  async getProgress(projectId: string): Promise<ProjectProgress | null> {
    return this.projects.get(projectId) || null;
  }
}