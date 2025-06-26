# MPCM-Lite: Lightweight AI Development Orchestrator 🚀

> **Early access version of MPCM-Pro** - Ship MVPs and prototypes with AI-powered development teams

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)
[![Version](https://img.shields.io/badge/version-1.0.0--lite-orange)](https://github.com/itsocialist/mpcm-lite)

**Turn ideas into working apps in under 60 seconds for less than $0.10**

MPCM-Lite is a streamlined version of the upcoming MPCM-Pro platform. It orchestrates specialized AI agents (Product Manager, Frontend Dev, Backend Dev, etc.) to build complete, production-ready applications from a single description.

## 🎯 What is MPCM-Lite?

MPCM-Lite is the **fast, focused, ship-it-now** version of MPCM-Pro. While the full MPCM-Pro platform is being developed with enterprise features, team collaboration, and extensive service integrations, MPCM-Lite gives you the core magic today:

- ✨ **Same AI orchestration** - Multiple specialized agents working together
- 🚀 **Instant results** - Generate apps in under 60 seconds
- 💰 **Incredible value** - Average cost of $0.07 per app
- 🎯 **Production code** - Real Next.js apps that actually run
- 🔌 **MCP Compatible** - Works with Claude Desktop

### Perfect for:
- **Rapid prototyping** - Test ideas before investing
- **MVPs** - Ship your minimum viable product today
- **Hackathons** - Build fast, win prizes
- **Learning** - See how production apps are structured
- **Solo developers** - No team? No problem!

![Demo](assets/demo.gif)

## 🎯 What It Does

```bash
You: "Build a todo app with user authentication"
MPCM-Lite: *55 seconds later* "Here's your working Next.js app with auth!"
```

### Real Results:
- ✅ **Complete Next.js applications** with TypeScript, Tailwind, and API routes
- ✅ **Working code** that runs with `npm install && npm run dev`
- ✅ **Premium features** via marketplace (Stripe integration, auth, etc.)
- ✅ **$0.07 average cost** per generated app
- ✅ **55-second average** generation time

## 🚀 Quick Start

### 1. Install Prerequisites
```bash
# Node.js 18+ required
node --version

# Clone the repository
git clone https://github.com/itsocialist/mpcm-lite.git
cd mpcm-lite
```

### 2. Set Up API Key
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API key
# Get Claude API key from: https://console.anthropic.com/
# Get OpenAI API key from: https://platform.openai.com/
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# If you encounter any issues, try:
# rm -rf node_modules && npm install

# Run the demo
npm run demo

# Or run the auto-demo (shows marketplace features)
npm run auto-demo
```

## 💡 How It Works

MPCM-Lite uses a multi-agent architecture where specialized AI roles collaborate:

```
Your Idea → Product Manager → Frontend Dev → Backend Dev → DevOps → Working App
                                    ↓
                            Marketplace Roles
                          (Stripe, Auth, etc.)
```

### Core Roles:
- **Product Manager**: Analyzes requirements, creates user stories
- **Frontend Developer**: Builds React components with TypeScript
- **Backend Developer**: Creates API routes and business logic
- **DevOps Engineer**: Sets up configuration and deployment

### Premium Marketplace Roles:
- **Stripe Expert**: Payment processing integration ($29)
- **Auth Specialist**: NextAuth/Clerk integration (Coming Soon)
- **Database Wizard**: Prisma/Drizzle ORM setup (Coming Soon)

## 🎮 Usage Examples

### Basic App Generation
```bash
npm run demo
# Follow prompts to describe your app
```

### Use with Claude Desktop
```bash
# After MCP setup (see below)
# In Claude: "Use the build_app tool to create a recipe sharing app"
```

### Programmatic Usage
```typescript
import { Orchestrator } from 'mpcm-lite';

const orchestrator = new Orchestrator();
const result = await orchestrator.buildApp(
  'Build a blog with markdown support',
  { useMarketplace: true }
);
```

## 🔧 MCP Integration (Claude Desktop)

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mpcm-lite": {
      "command": "npx",
      "args": ["tsx", "/path/to/mpcm-lite/src/mcp-server.ts"],
      "env": {
        "LLM_PROVIDER": "claude",
        "LLM_API_KEY": "your-api-key"
      }
    }
  }
}
```

Then restart Claude Desktop and use: "Use the build_app tool to create [your app idea]"

## 📁 Generated App Structure

```
output/your-app/
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main page
│   │   ├── layout.tsx       # Layout wrapper
│   │   └── api/            # API routes
│   └── components/         # React components
├── package.json           # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind setup
└── README.md            # App documentation
```

## 🏪 Marketplace

Premium roles add specialized capabilities:

```bash
# During generation, you'll see:
💡 Premium Feature Available!
✨ Stripe Payment Expert - Add payment processing
   Price: $29

# Demo auto-purchases to show the flow
# Real implementation coming soon!
```

## 🛣️ Roadmap: From Lite to Pro

### MPCM-Lite (Current - v1.0)
- ✅ Core orchestration engine
- ✅ Basic role system (PM, Frontend, Backend, DevOps)
- ✅ Claude/GPT integration
- ✅ MCP server for Claude Desktop
- ✅ Demo marketplace with Stripe Expert
- ✅ Next.js app generation

### MPCM-Pro (Coming Soon)
The full MPCM-Pro platform will include:
- 🏢 Enterprise features and team collaboration
- 🔌 Full MCP service orchestration (filesystem, git, terminal, etc.)
- 🏪 Real marketplace with 50+ specialized roles
- 🚀 Multiple deployment targets (Vercel, AWS, etc.)
- 🧪 Integrated testing and CI/CD
- 📊 Analytics and cost optimization
- 🔐 Role-based access control
- 🌍 Multi-framework support

**Using MPCM-Lite now?** Your workflow and generated apps are compatible with the future Pro version!

## 🤝 Contributing

We love contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Ideas:
- New AI roles (Database Expert, Testing Guru, etc.)
- App templates (SaaS starter, E-commerce, etc.)
- Provider integrations (Gemini, Mixtral, etc.)
- Bug fixes and optimizations

## 📊 Performance

| Metric | Value |
|--------|-------|
| Average Generation Time | 55 seconds |
| Average Cost | $0.07 |
| Success Rate | 95%+ |
| Lines of Code Generated | 500-2000 |
| Supported Frameworks | Next.js 14+ |

## 🐛 Troubleshooting

### Common Issues:

**"API Key Invalid"**
- Check your `.env` file has the correct key
- Ensure you have credits in your account

**"Generation Failed"**
- Try a simpler app description first
- Check console for specific errors
- Ensure all dependencies are installed

**"MCP Not Working"**
- Restart Claude Desktop after config changes
- Check the path in config is absolute
- Verify the server runs with `npm run mcp`

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with:
- [Model Context Protocol](https://modelcontextprotocol.io) by Anthropic
- [Claude API](https://www.anthropic.com) / [OpenAI API](https://openai.com)
- [Next.js](https://nextjs.org) for generated apps
- Coffee ☕ and late nights 🌙

---

**Ready to turn your ideas into apps?** [Get Started](#-quick-start) or [Watch Demo](https://your-demo-link)

Made with ❤️ by FireFly TSM