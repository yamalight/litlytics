import { CoreMessage, CoreTool } from 'ai';

export const LLMProvidersList = [
  'openai',
  'anthropic',
  'gemini',
  // 'azure',
  'cohere',
  'mistral',
  'groq',
  'perplexity',
] as const;
export type LLMProvider = (typeof LLMProvidersList)[number];

export const LLMModelsList = {
  local: [
    'Llama-3.1-70B-Instruct-q0f16-MLC',
    'Llama-3.1-70B-Instruct-q4f16_1-MLC',
    'Llama-3.1-8B-Instruct-q0f16-MLC',
    'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    'Hermes-3-Llama-3.1-8B-q0f16-MLC',
    'Hermes-3-Llama-3.1-8B-q4f16_1-MLC',
    'Phi-3.5-mini-instruct-q0f16-MLC',
    'Phi-3.5-mini-instruct-q4f16_0-MLC',
    'Mistral-7B-Instruct-v0.3-q0f16-MLC',
    'Mistral-7B-Instruct-v0.3-q4f16_0-MLC',
    'Qwen2-0.5B-Instruct-q0f16-MLC',
    'Qwen2-0.5B-Instruct-q4f16_0-MLC',
    'Qwen2-1.5B-Instruct-q0f16-MLC',
    'Qwen2-1.5B-Instruct-q4f16_0-MLC',
    'Qwen2-72B-Instruct-q0f16-MLC',
    'Qwen2-72B-Instruct-q4f16_1-MLC',
    'Qwen2-7B-Instruct-q0f16-MLC',
    'Qwen2-7B-Instruct-q4f16_1-MLC',
    'Mixtral-8x7B-Instruct-v0.1-q0f16-MLC',
    'Mixtral-8x7B-Instruct-v0.1-q4f16_1-MLC',
    'SmolLM-1.7B-Instruct-q0f16-MLC',
    'SmolLM-1.7B-Instruct-q4f16_1-MLC',
    'SmolLM-135M-Instruct-q0f16-MLC',
    'SmolLM-135M-Instruct-q4f16_1-MLC',
    'SmolLM-360M-Instruct-q0f16-MLC',
    'SmolLM-360M-Instruct-q4f16_1-MLC',
    'gemma-2-27b-it-q0f16-MLC',
    'gemma-2-27b-it-q4f16_1-MLC',
    'gemma-2-2b-it-q0f16-MLC',
    'gemma-2-2b-it-q4f16_0-MLC',
    'gemma-2-9b-it-q0f16-MLC',
    'gemma-2-9b-it-q4f16_1-MLC',
  ],
  anthropic: [
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-haiku-20240307',
  ],
  // azure: ['manual'],
  cohere: ['command-r-plus', 'command-r'],
  gemini: [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
  ],
  groq: [
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile',
    'llama3-groq-70b-8192-tool-use-preview',
    'mixtral-8x7b-32768',
    'gemma-7b-it',
    'gemma2-9b-it',
  ],
  mistral: [
    'open-mistral-7b',
    'open-mixtral-8x7b',
    'open-mixtral-8x22b',
    'open-mistral-nemo',
    'mistral-small-latest',
    'mistral-medium-latest',
    'mistral-large-latest',
  ],
  openai: [
    'o1-preview',
    'o1-mini',
    'gpt-4o',
    'gpt-4o-2024-05-13',
    'gpt-4o-2024-08-06',
    'gpt-4o-mini',
    'gpt-4o-mini-2024-07-18',
  ],
  perplexity: [
    'llama-3.1-sonar-large-128k-chat',
    'llama-3.1-sonar-small-128k-chat',
    'llama-3.1-8b-instruct',
    'llama-3.1-70b-instruct',
  ],
};
export type LLMModel =
  (typeof LLMModelsList)[keyof typeof LLMModelsList][number];

export interface LLMRequest {
  provider: LLMProvider;
  key: string;
  model: LLMModel;
  messages: CoreMessage[];
  modelArgs?: Record<string, CoreTool>;
}
