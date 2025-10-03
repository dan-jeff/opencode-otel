#!/bin/bash

# Install OpenCode OpenTelemetry Plugin Globally

set -e

echo "Building plugin..."
npm run bundle

echo "Creating plugin directory..."
mkdir -p ~/.opencode/plugin

echo "Installing plugin..."
cp dist/otel-plugin.bundle.js ~/.opencode/plugin/otel-plugin.js

echo "Installing dependencies in plugin directory..."
cd ~/.opencode/plugin
npm init -y --silent
npm install --silent \
  @opentelemetry/api@^1.9.0 \
  @opentelemetry/sdk-trace-node@^1.25.0 \
  @opentelemetry/exporter-trace-otlp-http@^0.52.0 \
  @opentelemetry/sdk-trace-base@^1.25.0 \
  @opentelemetry/resources@^1.25.0

echo "Plugin installed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your OTEL settings in ~/.opencode/otel-config.json"
echo "   Example:"
echo '   {'
echo '     "endpoint": "https://api.honeycomb.io/v1/traces",'
echo '     "headers": {'
echo '       "x-honeycomb-team": "YOUR_API_KEY"'
echo '     },'
echo '     "serviceName": "opencode-custom"'
echo '   }'
echo ""
echo "2. Test by running: opencode"
