# Contributing to MPCM-Pro

First off, thank you for considering contributing to MPCM-Pro! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs
- Check if the bug has already been reported
- Open a new issue with a clear title and description
- Include steps to reproduce
- Share your environment details (OS, Node version, etc.)

### 💡 Suggesting Features
- Open an issue with the `enhancement` label
- Clearly describe the feature and its benefits
- Include examples of how it would work

### 🧩 Adding New Roles
1. Create a new role in `src/roles/`
2. Follow the existing role pattern
3. Include comprehensive prompts
4. Add tests for your role
5. Document the role's capabilities

### 📝 Improving Documentation
- Fix typos, clarify instructions
- Add examples
- Improve setup guides
- Translate documentation

### 💻 Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingRole`)
3. Write tests first (TDD)
4. Implement your changes
5. Commit with clear messages
6. Push to your branch
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/mpcm-pro.git
cd mpcm-pro

# Install dependencies
npm install

# Set up your .env
cp .env.example .env
# Add your API keys

# Run tests
npm test

# Run in development
npm run dev
```

## Code Style

- TypeScript with strict mode
- No `any` types without justification
- Comprehensive error handling
- Clear variable and function names
- Comment complex logic

## Testing

- Write tests first (TDD is mandatory)
- Test the behavior, not implementation
- Mock external services
- Aim for >90% coverage

## Pull Request Process

1. Update README.md with any new features
2. Add tests for your changes
3. Ensure all tests pass
4. Update documentation
5. Request review from maintainers

## Ideas for Contributions

### New Roles
- **Database Expert**: Prisma/Drizzle schemas
- **Testing Guru**: Jest/Vitest test suites
- **Security Specialist**: Auth and security best practices
- **Performance Wizard**: Optimization and caching
- **Mobile Developer**: React Native components

### Features
- Additional LLM providers (Gemini, Mixtral)
- More app templates
- Better error recovery
- Progress persistence
- Team collaboration

### Infrastructure
- Docker support
- Cloud deployment guides
- CI/CD templates
- Performance monitoring

## Questions?

Join our Discord: [discord.gg/mpcm-pro](https://discord.gg/mpcm-pro)

Thank you for helping make MPCM-Pro better! 🚀