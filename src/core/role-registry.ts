import { RoleExecution } from '../types';
import { ProductManagerRole } from '../roles/product-manager';
import { FrontendDeveloperRole } from '../roles/frontend-developer';
import { BackendDeveloperRole } from '../roles/backend-developer';

export class RoleRegistry {
  private roles: Map<string, RoleExecution> = new Map();
  
  constructor() {
    this.registerDefaultRoles();
  }
  
  private registerDefaultRoles() {
    this.roles.set('product-manager', new ProductManagerRole());
    this.roles.set('frontend-developer', new FrontendDeveloperRole());
    this.roles.set('backend-developer', new BackendDeveloperRole());
  }
  
  async getRole(roleId: string): Promise<RoleExecution> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new Error(`Role not found: ${roleId}`);
    }
    return role;
  }
  
  registerRole(roleId: string, role: RoleExecution) {
    this.roles.set(roleId, role);
  }
}
