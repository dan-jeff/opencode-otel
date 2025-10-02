# Contributing to OpenCode OpenTelemetry Plugin

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Please read and follow these guidelines in all interactions with the project.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- TypeScript knowledge (the project is written in TypeScript)

### Development Setup

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/opencode-otel-plugin.git
   cd opencode-otel-plugin
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building the Project

```bash
npm run build
```

### Development Mode

For continuous compilation during development:

```bash
npm run dev
```

### Running Tests

Currently, the project doesn't have automated tests, but you can manually test the plugin by:

1. Building the project
2. Configuring your `.opencode/otel-config.json` with your OTEL endpoint
3. Using OpenCode with the plugin enabled

## Making Changes

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting and conventions
- Remove unused imports and variables
- Add meaningful comments for complex logic

### Commit Messages

Use clear and descriptive commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
feat: Add support for custom OTEL headers

Fixes #123. Allows users to configure custom headers for OTEL
exporters, enabling authentication with various telemetry platforms.
```

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md if you've added features that should be documented
3. Ensure your code follows the project's style guidelines
4. Run `npm run build` to ensure the project compiles without errors
5. Submit a pull request with a clear description of your changes

## Types of Contributions

### Bug Reports

When filing bug reports, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected vs. actual behavior
- Environment details (Node.js version, OS, etc.)
- Any relevant logs or error messages

### Feature Requests

Feature requests are welcome! Please provide:

- A clear description of the feature
- The motivation behind the feature
- How you envision it working
- Any potential implementation ideas

### Documentation

Documentation improvements are valuable contributions. You can help by:

- Improving existing documentation
- Adding examples
- Fixing typos or grammatical errors
- Translating documentation

## Project Structure

```
.
├── .opencode/
│   ├── plugin/
│   │   ├── otel-plugin.ts      # Main plugin implementation
│   │   └── otel-plugin.js      # Compiled JavaScript
│   ├── otel-config.json        # Configuration file (gitignored)
│   └── otel-config.example.json # Example configuration
├── src/                        # Source files (if any)
├── dist/                       # Compiled output
├── README.md                   # Project documentation
├── CONTRIBUTING.md             # This file
├── LICENSE                     # MIT License
├── package.json                # Project metadata
├── tsconfig.json              # TypeScript configuration
└── .gitignore                 # Git ignore rules
```

## Testing

While the project currently lacks automated tests, contributions that add test coverage are highly encouraged. Consider:

- Unit tests for core functionality
- Integration tests with OTEL collectors
- Mock tests for different LLM providers

## Release Process

Releases are managed through semantic versioning:

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Ask in the pull request
- Check existing issues and documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.