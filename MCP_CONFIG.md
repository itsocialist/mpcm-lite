# MPCM-Pro MCP Server Configuration

Add this to your Claude Desktop configuration file:

## macOS
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

## Windows  
Location: `%APPDATA%\Claude\claude_desktop_config.json`

## Configuration to add:

```json
{
  "mcpServers": {
    "mpcm-pro": {
      "command": "node",
      "args": ["/path/to/mpcm-poc-spike/dist/mcp-server.js"],
      "env": {
        "LLM_PROVIDER": "claude",
        "LLM_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Development mode (using tsx):

```json
{
  "mcpServers": {
    "mpcm-pro": {
      "command": "npx",
      "args": ["tsx", "/path/to/mpcm-poc-spike/src/mcp-server.ts"],
      "env": {
        "LLM_PROVIDER": "claude",
        "LLM_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## After adding:
1. Restart Claude Desktop
2. You should see "mpcm-pro" in the available tools
3. Try: "Use the build_app tool to create a todo app"
