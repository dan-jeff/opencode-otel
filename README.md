# OpenCode OpenTelemetry Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A custom OpenCode plugin that collects telemetry data including token counts, model names, and tool executions using OpenTelemetry.

## Features

- **Tool Execution Tracking**: Monitors tool name and arguments
- **LLM Token Tracking**: Captures input/output/total tokens across different providers
- **Event Monitoring**: Tracks various event types in the OpenCode ecosystem
- **Multi-Provider Support**: Works with different LLM providers (Anthropic, Gemini, Z.ai)
- **Configurable Endpoints**: Supports Honeycomb, custom OTEL collectors, and more

## Installation

### Quick Install (Recommended)

```bash
git clone https://github.com/dan-jeff/opencode-otel.git
cd opencode-otel
npm install
./install.sh
```

### Manual Install

1. Clone this repository:
```bash
git clone https://github.com/dan-jeff/opencode-otel.git
cd opencode-otel
```

2. Install dependencies:
```bash
npm install
```

3. Build and bundle the plugin:
```bash
npm run bundle
```

4. Install the plugin globally (all dependencies are bundled, ~2MB):
```bash
cp dist/otel-plugin.bundle.js ~/.opencode/plugin/otel-plugin.js
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

The plugin reads configuration from `.opencode/otel-config.json` in the following order:
1. Local project config: `./.opencode/otel-config.json` (in current directory)
2. Global config: `~/.opencode/otel-config.json` (in home directory)

Configuration options:
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

| Provider | Status |
|----------|--------|
| Anthropic Claude | ✅ |
| Google Gemini | ✅ |
| Z.ai | ✅ |

## Development

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.
