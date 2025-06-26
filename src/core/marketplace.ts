import CryptoJS from 'crypto-js';
import { MarketplaceRole, RoleExecution } from '../types';
import { StripeExpertRole } from '../roles/stripe-expert';

export class Marketplace {
  private encryptionKey = 'MPCM-PRO-DEMO-KEY-2024';
  
  // Simulate marketplace roles
  private marketplaceRoles: Map<string, MarketplaceRole> = new Map([
    ['stripe-expert', {
      id: 'stripe-expert',
      name: 'Stripe Payment Expert',
      systemPrompt: 'Expert in Stripe integration',
      encrypted: true,
      price: 29,
      encryptedContent: this.encryptRole(new StripeExpertRole())
    }]
  ]);
  
  private purchasedRoles: Set<string> = new Set();
  
  async purchaseRole(roleId: string, licenseKey: string): Promise<RoleExecution | null> {
    // Simulate license validation
    if (!this.validateLicense(licenseKey)) {
      return null;
    }
    
    const marketplaceRole = this.marketplaceRoles.get(roleId);
    if (!marketplaceRole) {
      throw new Error(`Role not found: ${roleId}`);
    }
    
    this.purchasedRoles.add(roleId);
    
    // For demo: just return the role
    return new StripeExpertRole();
  }
  
  isPurchased(roleId: string): boolean {
    return this.purchasedRoles.has(roleId);
  }
  
  getRole(roleId: string): MarketplaceRole | undefined {
    return this.marketplaceRoles.get(roleId);
  }
  
  private validateLicense(licenseKey: string): boolean {
    // Demo license keys
    return ['DEMO-2024', 'MPCM-STRIPE-EXPERT'].includes(licenseKey);
  }
  
  private encryptRole(role: RoleExecution): string {
    // Simple encryption for demo
    const roleData = JSON.stringify({
      className: role.constructor.name,
      timestamp: Date.now()
    });
    
    return CryptoJS.AES.encrypt(roleData, this.encryptionKey).toString();
  }
}
