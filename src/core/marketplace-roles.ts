import { AIRole, RoleContext, RoleResult } from './ai-roles';
import { LLMProvider } from './llm-provider';
import * as crypto from 'crypto';

export interface MarketplaceRoleMetadata {
  id: string;
  name: string;
  description: string;
  price: number;
  capabilities: string[];
  author: string;
  version: string;
  rating: number;
  downloads: number;
}

export class MarketplaceRole extends AIRole {
  constructor(
    protected metadata: MarketplaceRoleMetadata,
    protected llmProvider: LLMProvider,
    private encryptedPrompts?: string
  ) {
    super(metadata.id, llmProvider);
  }
  
  getSystemPrompt(): string {
    // In production, this would decrypt the prompts
    // For POC, we'll use the actual prompt
    return this.getDecryptedPrompt();
  }
  
  private getDecryptedPrompt(): string {
    // Simulated decryption for POC
    return `You are a Stripe Payments Integration Expert.
You specialize in implementing complete payment systems using Stripe.

Your expertise includes:
- Stripe Checkout for one-time payments
- Subscription management with Stripe Billing
- Customer portal setup
- Webhook handling for payment events
- Invoice generation and management
- Payment method management
- SCA/3D Secure compliance

When implementing payments, you provide:
1. Complete Stripe integration code
2. Secure API route implementations
3. Frontend checkout components
4. Webhook handlers
5. Testing instructions

Always use best practices:
- Never expose secret keys client-side
- Implement proper error handling
- Add idempotency keys
- Handle all webhook events properly
- Include proper TypeScript types

Output production-ready code that handles real money.`;
  }
  
  async execute(task: string, context: RoleContext): Promise<RoleResult> {
    const prompt = `
Project Context: ${context.projectDescription}
Task: ${task}

Implement a complete Stripe payment system for this project.
Include checkout, subscriptions, customer portal, and webhooks.
Use Next.js API routes and React components.

Provide:
1. Installation instructions
2. Environment variables needed
3. Complete API routes code
4. React components for checkout
5. Webhook handler implementation
6. Testing steps
`;
    
    const { content, cost } = await this.callLLM(prompt);
    
    return {
      output: content,
      nextSteps: ['test_payments', 'configure_stripe_dashboard'],
      dependencies: ['api_routes', 'frontend_components'],
      cost
    };
  }
}

// Marketplace Role Registry
export class MarketplaceRegistry {
  private roles: Map<string, MarketplaceRoleMetadata> = new Map();
  private licenses: Map<string, Set<string>> = new Map(); // roleId -> userIds
  
  constructor() {
    // Pre-populate with Stripe Expert
    this.addRole({
      id: 'stripe-expert',
      name: 'Stripe Payment Expert',
      description: 'Complete Stripe integration with checkout, subscriptions, and webhooks',
      price: 29,
      capabilities: [
        'payment-processing',
        'subscriptions',
        'invoicing',
        'customer-portal',
        'webhooks'
      ],
      author: 'mpcm-pro',
      version: '1.0.0',
      rating: 4.9,
      downloads: 1249
    });
  }
  
  addRole(metadata: MarketplaceRoleMetadata): void {
    this.roles.set(metadata.id, metadata);
  }
  
  getRole(roleId: string): MarketplaceRoleMetadata | undefined {
    return this.roles.get(roleId);
  }
  
  hasLicense(roleId: string, userId: string): boolean {
    return this.licenses.get(roleId)?.has(userId) || false;
  }
  
  purchaseRole(roleId: string, userId: string): { success: boolean; message: string } {
    // In production, this would handle real payments
    // For POC, we simulate instant purchase
    
    const role = this.roles.get(roleId);
    if (!role) {
      return { success: false, message: 'Role not found' };
    }
    
    // Add license
    if (!this.licenses.has(roleId)) {
      this.licenses.set(roleId, new Set());
    }
    this.licenses.get(roleId)!.add(userId);
    
    return {
      success: true,
      message: `Successfully purchased ${role.name} for $${role.price}`
    };
  }
  
  createMarketplaceRole(
    metadata: MarketplaceRoleMetadata, 
    llmProvider: LLMProvider
  ): MarketplaceRole {
    return new MarketplaceRole(metadata, llmProvider);
  }
}
