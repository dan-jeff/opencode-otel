# OpenCode OpenTelemetry Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A custom OpenCode plugin that collects telemetry data including token counts, model names, and tool executions using OpenTelemetry.

## Features

- **Tool Execution Tracking**: Monitors tool name and arguments
- **LLM Token Tracking**: Captures input/output/total tokens across different providers
- **Event Monitoring**: Tracks various event types in the OpenCode ecosystem
- **Multi-Provider Support**: Works with different LLM providers (OpenAI, Gemini, etc.)
- **Configurable Endpoints**: Supports Honeycomb, custom OTEL collectors, and more

## Installation

### From Source

1. Clone this repository:
```bash
git clone https://github.com/your-username/opencode-otel-plugin.git
cd opencode-otel-plugin
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

4. Copy the plugin to your OpenCode plugins directory:
```bash
cp .opencode/plugin/otel-plugin.js ~/.opencode/plugins/
```

5. Configure your OTEL settings in `~/.opencode/otel-config.json`:
```json
{
  "endpoint": "https://api.honeycomb.io/v1/traces",
  "headers": {
    "x-honeycomb-team": "YOUR_API_KEY"
  },
  "serviceName": "opencode-custom"
}
```

## Configuration

The plugin reads configuration from `.opencode/otel-config.json`:

- `endpoint`: OTEL collector endpoint (default: `http://localhost:4318/v1/traces`)
- `headers`: Custom headers for authentication (e.g., API keys)
- `serviceName`: Service name for tracing (default: `opencode`)

## OpenTelemetry Data Fields

This plugin sends the following attributes to your OpenTelemetry collector:

### Tool Execution Spans (`tool.*`)
| Field | Type | Description |
|-------|------|-------------|
| `tool.name` | string | Name of the tool executed |
| `tool.args` | string | Tool arguments as JSON string |

### LLM Message Spans (`llm.message`)
| Field | Type | Description |
|-------|------|-------------|
| `model` | string | Model name/ID used for the request |
| `token.input` | number | Input tokens (prompt_tokens, input_tokens, input) |
| `token.output` | number | Output tokens (completion_tokens, output_tokens, output) |
| `token.total` | number | Total tokens consumed |
| `token.reasoning` | number | Reasoning tokens (for supported models) |
| `role` | string | Message role (user/assistant/system) |

### Event Spans (`event.*`)
| Field | Type | Description |
|-------|------|-------------|
| `event.type` | string | Type of event (message.completed, message.updated, etc.) |
| `model` | string | Model ID from event properties |
| `provider` | string | Provider ID (anthropic, google, etc.) |
| `token.input` | number | Input token count from event |
| `token.output` | number | Output token count from event |
| `token.reasoning` | number | Reasoning token count from event |
| `token.total` | number | Total token count from event |
| `cache.read` | number | Cache read tokens (when available) |
| `cache.write` | number | Cache write tokens (when available) |
| `role` | string | Message role from event properties |

## Supported Providers

| Provider | Verified |
|----------|----------|
| Anthropic Claude | ✅ |
| Google Gemini | ✅ |
| Z.ai | ✅ |
| OpenAI | ❌ |
| Other OTEL-compatible providers | ❌ |

## Development

### Setup

1. Fork and clone the repository
2. Install dependencies:
```bash
npm install
```

### Building

Build the TypeScript source:
```bash
npm run build
```

### Development Mode

Watch mode for continuous compilation:
```bash
npm run dev
```

### Testing

Manual testing:
1. Build the plugin with `npm run build`
2. Configure `.opencode/otel-config.json` with your OTEL endpoint
3. Run [OpenCode](https://opencode.ai/) with the plugin enabled
4. Monitor your telemetry backend for incoming traces

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines including:

- Code of conduct
- Development setup
- Code style guidelines
- Commit message conventions
- Pull request process

Quick start:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and build (`npm run build`)
4. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

## Acknowledgments

- Built for [OpenCode](https://opencode.ai/) - an AI-powered coding assistant
- Uses [OpenTelemetry](https://opentelemetry.io/) for observability
- Supports multiple telemetry backends including Honeycomb and custom OTEL collectors
