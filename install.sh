#!/bin/bash

# Install OpenCode OpenTelemetry Plugin Globally

set -e

echo "Building plugin..."
npm run bundle

echo "Creating plugin directory..."
mkdir -p ~/.opencode/plugin

echo "Installing plugin..."
cp dist/otel-plugin.bundle.js ~/.opencode/plugin/otel-plugin.js

echo "Plugin installed successfully! (All dependencies bundled: $(du -h dist/otel-plugin.bundle.js | cut -f1))"
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
