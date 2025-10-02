import type { Plugin } from "@opencode-ai/plugin"
import { trace } from '@opentelemetry/api'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Resource } from '@opentelemetry/resources'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

interface OTelConfig {
  endpoint: string
  headers: Record<string, string>
  serviceName: string
}

const plugin: Plugin = async () => {
  const localConfigPath = resolve(process.cwd(), '.opencode/otel-config.json')
  const globalConfigPath = resolve(process.env['HOME'] || '', '.opencode/otel-config.json')
  
  let config: OTelConfig = {
    endpoint: 'http://localhost:4318/v1/traces',
    headers: {},
    serviceName: 'opencode'
  }

  const configPath = existsSync(localConfigPath) ? localConfigPath : globalConfigPath
  
  if (existsSync(configPath)) {
    try {
      const configData = readFileSync(configPath, 'utf-8')
      config = { ...config, ...JSON.parse(configData) }
    } catch (error) {
      console.error('Failed to load OTEL config:', error)
    }
  }

  const resource = new Resource({
    'service.name': config.serviceName,
  })

  const provider = new NodeTracerProvider({ resource })
  const exporter = new OTLPTraceExporter({
    url: config.endpoint,
    headers: config.headers,
  })
  
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
  provider.register()
  
  const tracer = trace.getTracer(config.serviceName)
  
  return {
    tool: {
      execute: {
        before: async (_input: any, output: any) => {
          const span = tracer.startSpan(`tool.${_input.tool}`)
          span.setAttribute('tool.name', _input.tool)
          span.setAttribute('tool.args', JSON.stringify(output.args))
          return { span }
        },
        after: async (_input: any, _output: any, context: any) => {
          if (context?.span) {
            context.span.end()
          }
        }
      }
    },
    "chat.message": async (_input: any, output: any) => {
      const span = tracer.startSpan('llm.message')
      
      if (output?.message) {
        // Check for usage in message metadata
        if (output.message.usage) {
          const inputTokens = output.message.usage.input_tokens || 
                            output.message.usage.prompt_tokens || 
                            output.message.usage.input || 0
          const outputTokens = output.message.usage.output_tokens || 
                             output.message.usage.completion_tokens || 
                             output.message.usage.output || 0
          const totalTokens = output.message.usage.total_tokens || 
                            (inputTokens + outputTokens)
          
          span.setAttribute('token.input', inputTokens)
          span.setAttribute('token.output', outputTokens)
          span.setAttribute('token.total', totalTokens)
        }
        
        if (output.message.model) {
          span.setAttribute('model', output.message.model)
        }
        
        // Set role for filtering
        span.setAttribute('role', output.message.role || 'unknown')
      }
      
      span.end()
    },
    event: async ({ event }: any) => {
      const span = tracer.startSpan(`event.${event.type}`)
      span.setAttribute('event.type', event.type)
      
      // Handle message events for token tracking
      if ((event.type === 'message.completed' || event.type === 'message.updated') && event.properties?.info) {
        const message = event.properties.info
        
        // Check for token usage in different locations
        let tokenData = null
        
        if (message.tokens) {
          tokenData = message.tokens
        } else if (message.usage) {
          tokenData = message.usage
        }
        
        if (tokenData) {
          // Handle GLM token format (input, output, reasoning, cache)
          const inputTokens = tokenData.input || 
                            tokenData.input_tokens || 
                            tokenData.prompt_tokens || 
                            tokenData.read || 
                            (tokenData.cache?.read) || 0
          const outputTokens = tokenData.output || 
                             tokenData.output_tokens || 
                             tokenData.completion_tokens || 0
          const reasoningTokens = tokenData.reasoning || 0
          const totalTokens = tokenData.total || 
                             tokenData.total_tokens || 
                             (inputTokens + outputTokens + reasoningTokens)
          
          span.setAttribute('token.input', inputTokens)
          span.setAttribute('token.output', outputTokens)
          span.setAttribute('token.reasoning', reasoningTokens)
          span.setAttribute('token.total', totalTokens)
          span.setAttribute('model', message.modelID || 'unknown')
          span.setAttribute('provider', message.providerID || 'unknown')
          span.setAttribute('role', message.role || 'unknown')
          
          // Add cache info if available
          if (tokenData.cache) {
            span.setAttribute('cache.read', tokenData.cache.read || 0)
            span.setAttribute('cache.write', tokenData.cache.write || 0)
          }
        }
      }
      
      span.end()
    }
  }
}

export default plugin
