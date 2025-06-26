export interface WorkflowStep {
  role: string;
  input: any;
  outputKey: string;
}

export interface WorkflowContext {
  [key: string]: any;
}

export interface Role {
  id: string;
  name: string;
  systemPrompt: string;
  encrypted?: boolean;
  price?: number;
}

export interface RoleExecution {
  execute(input: any, context: WorkflowContext): Promise<any>;
}

export interface MarketplaceRole extends Role {
  encrypted: true;
  price: number;
  encryptedContent: string;
}

export interface AppOutput {
  requirements?: string;
  frontend_code?: string;
  backend_code?: string;
  payment_code?: string;
  files?: GeneratedFile[];
}

export interface GeneratedFile {
  path: string;
  content: string;
}
