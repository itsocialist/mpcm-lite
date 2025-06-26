import { LLMProvider, LLMMessage, LLMCompletion, LLMOptions, LLMStreamChunk } from '../core/llm-provider';

/**
 * Mock provider for testing without API costs
 */
export class MockProvider implements LLMProvider {
  name = 'mock';
  private responses: Map<string, string> = new Map();
  
  constructor() {
    this.setupDefaultResponses();
  }
  
  private setupDefaultResponses() {
    // Product Manager responses
    this.responses.set('product-manager', JSON.stringify({
      title: "Mock App Requirements",
      overview: "A modern web application built with Next.js",
      features: [
        "User authentication",
        "CRUD operations",
        "Responsive design"
      ],
      technicalRequirements: {
        frontend: "Next.js with TypeScript",
        styling: "Tailwind CSS",
        database: "PostgreSQL",
        deployment: "Vercel"
      }
    }));
    
    // Frontend Developer responses
    this.responses.set('frontend-developer', `
// Mock React Component
import React from 'react';

export default function AppComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Mock App</h1>
      <p>This is a mock response for testing</p>
    </div>
  );
}
`);
    
    // Backend Developer responses
    this.responses.set('backend-developer', `
// Mock API Route
export async function GET(request: Request) {
  return Response.json({ 
    message: "Mock API response",
    data: [] 
  });
}
`);
  }
  
  async complete(messages: LLMMessage[], options?: LLMOptions): Promise<LLMCompletion> {
    // Extract role from system prompt or use default
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const roleMatch = systemMessage.match(/role[:\s]+(\w+-?\w+)/i);
    const role = roleMatch ? roleMatch[1].toLowerCase() : 'general';
    
    // Get mock response for role
    const mockResponse = this.responses.get(role) || 'Mock response for: ' + messages[messages.length - 1].content;
    
    const usage = {
      promptTokens: 100,
      completionTokens: 50,
      totalTokens: 150
    };
    
    return {
      content: mockResponse,
      usage,
      cost: 0, // Free for testing!
      model: 'mock-model'
    };
  }
  
  async *stream(messages: LLMMessage[], options?: LLMOptions): AsyncIterator<LLMStreamChunk> {
    const completion = await this.complete(messages, options);
    const words = completion.content.split(' ');
    
    for (const word of words) {
      yield {
        content: word + ' ',
        isComplete: false
      };
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    yield {
      content: '',
      isComplete: true
    };
  }
  
  async countTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
  
  estimateCost(promptTokens: number, completionTokens: number): number {
    return 0; // Free for testing
  }
  
  // Test helper to set custom responses
  setResponse(role: string, response: string): void {
    this.responses.set(role, response);
  }
}
