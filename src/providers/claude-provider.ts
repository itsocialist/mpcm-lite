import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, LLMMessage, LLMCompletion, LLMOptions, LLMStreamChunk, costTracker } from '../core/llm-provider';

export class ClaudeProvider implements LLMProvider {
  name = 'claude';
  private client: Anthropic;
  
  // Pricing per million tokens (as of 2024)
  private pricing = {
    'claude-3-opus-20240229': { input: 15, output: 75 },
    'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  };
  
  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }
  
  async complete(messages: LLMMessage[], options?: LLMOptions): Promise<LLMCompletion> {
    const model = options?.model || 'claude-3-5-sonnet-20241022';
    const maxTokens = options?.maxTokens || 4096;
    
    // Separate system message from conversation
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature: options?.temperature || 0.7,
        system: systemMessage,
        messages: conversationMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });
      
      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';
      
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      };
      
      const cost = this.estimateCost(usage.promptTokens, usage.completionTokens, model);
      
      // Track the cost
      costTracker.track(
        this.name,
        model,
        usage.promptTokens,
        usage.completionTokens,
        cost,
        options?.systemPrompt || 'general'
      );
      
      return {
        content,
        usage,
        cost,
        model,
      };
    } catch (error: any) {
      console.error('Claude API error:', error);
      throw new Error(`Claude completion failed: ${error.message}`);
    }
  }
  
  async *stream(messages: LLMMessage[], options?: LLMOptions): AsyncIterator<LLMStreamChunk> {
    const model = options?.model || 'claude-3-5-sonnet-20241022';
    const maxTokens = options?.maxTokens || 4096;
    
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    try {
      const stream = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature: options?.temperature || 0.7,
        system: systemMessage,
        messages: conversationMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        stream: true,
      });
      
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield {
            content: chunk.delta.text,
            isComplete: false,
          };
        } else if (chunk.type === 'message_stop') {
          yield {
            content: '',
            isComplete: true,
          };
        }
      }
    } catch (error: any) {
      console.error('Claude streaming error:', error);
      throw new Error(`Claude streaming failed: ${error.message}`);
    }
  }
  
  async countTokens(text: string): Promise<number> {
    // Rough estimation: ~4 characters per token for Claude
    // For production, use proper tokenizer
    return Math.ceil(text.length / 4);
  }
  
  estimateCost(promptTokens: number, completionTokens: number, model?: string): number {
    const modelName = model || 'claude-3-5-sonnet-20241022';
    const pricing = this.pricing[modelName] || this.pricing['claude-3-5-sonnet-20241022'];
    
    const inputCost = (promptTokens / 1_000_000) * pricing.input;
    const outputCost = (completionTokens / 1_000_000) * pricing.output;
    
    return inputCost + outputCost;
  }
}