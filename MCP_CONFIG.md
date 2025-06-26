# MPCM-Lite MCP Server Configuration

## Quick Setup

Add MPCM-Lite to your Claude Desktop to use AI-powered app generation directly in Claude!

## macOS
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

## Windows  
Location: `%APPDATA%\Claude\claude_desktop_config.json`

## Configuration to add:

```json
{
  "mcpServers": {
    "mpcm-lite": {
      "command": "node",
      "args": ["/path/to/mpcm-lite/dist/mcp-server.js"],
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
    "mpcm-lite": {
      "command": "npx",
      "args": ["tsx", "/path/to/mpcm-lite/src/mcp-server.ts"],
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
2. You should see "mpcm-lite" in the available tools
3. Try: "Use the build_app tool to create a todo app"

## Troubleshooting

If MPCM-Lite doesn't appear:
- Make sure the path is absolute (starts with `/`)
- Check that you have Node.js installed
- Verify your API key is valid
- Try the development mode configuration if the build isn't working

Need help? Open an issue on GitHub!
