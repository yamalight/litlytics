import { CoreMessage, CoreTool } from 'ai';

export const LLMProvidersList = [
  'openai',
  'anthropic',
  'gemini',
  // 'azure',
  // 'cohere',
  // 'mistral',
  // 'groq',
  // 'perplexity',
] as const;
export type LLMProvider = (typeof LLMProvidersList)[number];

export const LLMModelsList = {
  local: [
    'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    'Phi-3.5-mini-instruct-q4f16_1-MLC',
    'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    'gemma-2-9b-it-q4f16_1-MLC',
  ],
  anthropic: [
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-haiku-20240307',
  ],
  gemini: [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
  ],
  openai: [
    'gpt-4o-mini',
    'gpt-4o-mini-2024-07-18',
    'gpt-4o',
    'gpt-4o-2024-05-13',
    'gpt-4o-2024-08-06',
    'o1-mini',
    'o1-preview',
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
