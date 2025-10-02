import { trace, context } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
const plugin = async () => {
    const configPath = resolve(process.cwd(), '.opencode/otel-config.json');
    let config = {
        endpoint: 'http://localhost:4318/v1/traces',
        headers: {},
        serviceName: 'opencode'
    };
    if (existsSync(configPath)) {
        try {
            const configData = readFileSync(configPath, 'utf-8');
            config = { ...config, ...JSON.parse(configData) };
        }
        catch (error) {
            console.error('Failed to load OTEL config:', error);
        }
    }
    const resource = new Resource({
        'service.name': config.serviceName,
    });
    const provider = new NodeTracerProvider({ resource });
    const exporter = new OTLPTraceExporter({
        url: config.endpoint,
        headers: config.headers,
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register();
    const tracer = trace.getTracer(config.serviceName);
    return {
        tool: {
            execute: {
                before: async (input, output) => {
                    const span = tracer.startSpan(`tool.${input.tool}`);
                    span.setAttribute('tool.name', input.tool);
                    span.setAttribute('tool.args', JSON.stringify(output.args));
                    return { span };
                },
                after: async (input, output, context) => {
                    if (context?.span) {
                        context.span.end();
                    }
                }
            }
        },
        response: {
            before: async (input) => {
                const span = tracer.startSpan('llm.request');
                span.setAttribute('model', input.model || 'unknown');
                return { span };
            },
            after: async (input, output, context) => {
                if (context?.span) {
                    if (output?.usage) {
                        context.span.setAttribute('token.input', output.usage.input_tokens || 0);
                        context.span.setAttribute('token.output', output.usage.output_tokens || 0);
                        context.span.setAttribute('token.total', (output.usage.input_tokens || 0) + (output.usage.output_tokens || 0));
                    }
                    context.span.setAttribute('model', input.model || 'unknown');
                    context.span.end();
                }
            }
        },
        event: async ({ event }) => {
            const span = tracer.startSpan(`event.${event.type}`);
            span.setAttribute('event.type', event.type);
            span.end();
        }
    };
};
export default plugin;
//# sourceMappingURL=otel-plugin.js.map