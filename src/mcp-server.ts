import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { LLMProviderFactory } from './core/llm-provider';
import { ProductManagerRole, FrontendDeveloperRole, BackendDeveloperRole } from './core/ai-roles';
import { MarketplaceRegistry } from './core/marketplace-roles';
import { Orchestrator } from './core/orchestrator-v2';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize server
const server = new Server(
  {
    name: 'mpcm-pro',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize components
const llmProvider = LLMProviderFactory.create(
  process.env.LLM_PROVIDER as 'claude' | 'gpt' || 'claude',
  process.env.LLM_API_KEY || ''
);

const marketplace = new MarketplaceRegistry();
const orchestrator = new Orchestrator(llmProvider, marketplace);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'build_app',
        description: 'Build a complete application from a description using AI development team',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Natural language description of the app to build',
            },
            useMarketplace: {
              type: 'boolean',
              description: 'Whether to suggest premium marketplace roles when applicable',
              default: true,
            },
          },
          required: ['description'],
        },
      },
      {
        name: 'check_progress',
        description: 'Check the progress of an ongoing app build',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The project ID returned from build_app',
            },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'purchase_role',
        description: 'Purchase a premium role from the marketplace',
        inputSchema: {
          type: 'object',
          properties: {
            roleId: {
              type: 'string',
              description: 'The ID of the role to purchase',
            },
          },
          required: ['roleId'],
        },
      },
    ],
  };
});

// Tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'build_app': {
        const { description, useMarketplace } = args;
        
        // Start orchestration
        const result = await orchestrator.buildApp(description, {
          useMarketplace: useMarketplace ?? true,
          streaming: true,
        });
        
        if (result.status === 'marketplace_suggestion') {
          return {
            content: [
              {
                type: 'text',
                text: result.message + '\n\nUse the purchase_role tool to add this capability.',
              },
            ],
          };
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ App successfully built!\n\n${result.summary}\n\n🚀 Live at: ${result.deploymentUrl}\n💰 Total cost: $${result.totalCost.toFixed(2)}`,
            },
          ],
        };
      }
      
      case 'check_progress': {
        const { projectId } = args;
        const progress = await orchestrator.getProgress(projectId);
        
        return {
          content: [
            {
              type: 'text',
              text: `Progress: ${progress.percentage}%\nCurrent step: ${progress.currentStep}\nElapsed: ${progress.elapsed}s`,
            },
          ],
        };
      }
      
      case 'purchase_role': {
        const { roleId } = args;
        const result = marketplace.purchaseRole(roleId, 'current-user');
        
        return {
          content: [
            {
              type: 'text',
              text: result.message,
            },
          ],
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MPCM-Pro MCP server running...');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
