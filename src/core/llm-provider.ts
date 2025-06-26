import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalCost: number;
  };
}

export interface LLMProvider {
  complete(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
  stream(prompt: string, systemPrompt?: string): AsyncIterableIterator<string>;
}

export class ClaudeProvider implements LLMProvider {
  private client: Anthropic;
  
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }
  
  async complete(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const message = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    });
    
    const content = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    return {
      content,
      usage: {
        promptTokens: message.usage.input_tokens,
        completionTokens: message.usage.output_tokens,
        totalCost: this.calculateCost(message.usage)
      }
    };
  }
  
  async *stream(prompt: string, systemPrompt?: string): AsyncIterableIterator<string> {
    const stream = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    });
    
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text;
      }
    }
  }
  
  private calculateCost(usage: any): number {
    // Claude 3.5 Sonnet pricing
    const inputCost = (usage.input_tokens / 1000) * 0.003;
    const outputCost = (usage.output_tokens / 1000) * 0.015;
    return inputCost + outputCost;
  }
}

export class GPTProvider implements LLMProvider {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  
  async complete(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt }
      ],
      max_tokens: 4000
    });
    
    return {
      content: completion.choices[0].message.content || '',
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalCost: this.calculateCost(completion.usage)
      }
    };
  }
  
  async *stream(prompt: string, systemPrompt?: string): AsyncIterableIterator<string> {
    const stream = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt }
      ],
      max_tokens: 4000,
      stream: true
    });
    
    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || '';
    }
  }
  
  private calculateCost(usage: any): number {
    if (!usage) return 0;
    // GPT-4 Turbo pricing
    const inputCost = (usage.prompt_tokens / 1000) * 0.01;
    const outputCost = (usage.completion_tokens / 1000) * 0.03;
    return inputCost + outputCost;
  }
}

// Factory for creating providers
export class LLMProviderFactory {
  static create(type: 'claude' | 'gpt', apiKey: string): LLMProvider {
    switch (type) {
      case 'claude':
        return new ClaudeProvider(apiKey);
      case 'gpt':
        return new GPTProvider(apiKey);
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }
}
