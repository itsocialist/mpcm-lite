import { BaseRole } from './base-role';
import { WorkflowContext } from '../types';

export class LLMProductManager extends BaseRole {
  id = 'product-manager';
  name = 'Product Manager';
  systemPrompt = `You are an experienced Product Manager who transforms user ideas into detailed requirements.

Your responsibilities:
- Understand the user's vision and intent
- Create comprehensive requirements documents
- Define user stories and acceptance criteria
- Specify technical requirements and constraints
- Consider edge cases and error scenarios
- Prioritize features for MVP vs future releases

Output format: Structured JSON with:
- title: Project name
- overview: Executive summary
- features: Array of feature objects with name, description, priority
- userStories: Array of user stories in standard format
- technicalRequirements: Frontend, backend, database, deployment specs
- mvpScope: What's included in the first version
- futureEnhancements: Features for later versions`;

  temperature = 0.7; // Balanced creativity and consistency
  
  async execute(input: any, context: WorkflowContext): Promise<any> {
    // The orchestrator will handle the LLM call
    // This method is for any role-specific processing
    
    // For now, just return a structured prompt
    return {
      role: this.id,
      prompt: this.buildPrompt(input, context)
    };
  }
  
  private buildPrompt(input: any, context: WorkflowContext): string {
    let prompt = `Please analyze the following project request and create comprehensive requirements:\n\n`;
    
    if (typeof input === 'string') {
      prompt += `Project Description: ${input}\n`;
    } else {
      prompt += `Project Details:\n${JSON.stringify(input, null, 2)}\n`;
    }
    
    prompt += `
Please provide a complete requirements document including:
1. Clear project title and overview
2. Detailed feature list with priorities (MVP, Nice-to-have, Future)
3. User stories in "As a... I want... So that..." format
4. Technical requirements (stack, integrations, deployment)
5. MVP scope definition
6. Success criteria

Format the response as valid JSON.`;
    
    return prompt;
  }
  
  parseOutput(llmResponse: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, try to parse the whole response
      return JSON.parse(llmResponse);
    } catch (error) {
      // If parsing fails, structure it ourselves
      console.warn('Failed to parse PM output as JSON, structuring manually');
      
      return {
        title: this.extractSection(llmResponse, 'title') || 'Untitled Project',
        overview: this.extractSection(llmResponse, 'overview') || llmResponse.slice(0, 200),
        features: this.extractFeatures(llmResponse),
        technicalRequirements: {
          frontend: 'Next.js with TypeScript',
          backend: 'Next.js API Routes',
          database: 'PostgreSQL',
          deployment: 'Vercel'
        },
        mvpScope: this.extractSection(llmResponse, 'mvp') || 'Core features',
        raw: llmResponse // Keep raw response for debugging
      };
    }
  }
  
  private extractSection(text: string, section: string): string | null {
    const regex = new RegExp(`${section}[:\s]+([^\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }
  
  private extractFeatures(text: string): any[] {
    // Simple feature extraction
    const features = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
        const feature = line.replace(/^[-*\d.]\s+/, '').trim();
        if (feature.length > 10) {
          features.push({
            name: feature.slice(0, 50),
            description: feature,
            priority: 'MVP'
          });
        }
      }
    }
    
    return features.length > 0 ? features : [
      { name: 'Core functionality', description: 'Main application features', priority: 'MVP' }
    ];
  }
}
