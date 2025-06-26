import { describe, it, expect } from 'vitest';
import { Orchestrator } from '../src/core/orchestrator';
import { WorkflowStep } from '../src/types';

describe('Orchestrator', () => {
  it('should execute a simple workflow with PM and Frontend roles', async () => {
    const orchestrator = new Orchestrator();
    
    const workflow: WorkflowStep[] = [
      {
        role: 'product-manager',
        input: 'Build a todo app',
        outputKey: 'requirements'
      },
      {
        role: 'frontend-developer', 
        input: { requirements: '{{requirements}}' },
        outputKey: 'frontend_code'
      }
    ];
    
    const result = await orchestrator.runWorkflow(workflow);
    
    expect(result).toBeDefined();
    expect(result.requirements).toContain('todo');
    expect(result.frontend_code).toContain('React');
  });
});
