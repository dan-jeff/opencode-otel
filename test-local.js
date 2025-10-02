import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { readFileSync } from 'fs';

const configData = readFileSync('.opencode/otel-config.json', 'utf-8');
const config = JSON.parse(configData);

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

const span = tracer.startSpan('test.trace');
span.setAttribute('test.type', 'manual');
span.setAttribute('token.input', 100);
span.setAttribute('token.output', 50);
span.setAttribute('model', 'claude-sonnet-4');
span.end();

setTimeout(() => {
  provider.forceFlush().then(() => {
    process.exit(0);
  });
}, 1000);
