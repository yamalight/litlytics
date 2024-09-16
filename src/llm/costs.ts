import { LLMModel } from './types';

const gpto1pre = {
  input: 1500 / 1000000, // $15 / 1M input tokens
  output: 6000 / 1000000, // $60 / 1M output tokens
};
const gpto1mini = {
  input: 300 / 1000000, // $3 / 1M input tokens
  output: 1200 / 1000000, // $12 / 1M output tokens
};
const gpt4o = {
  input: 500 / 1000000, // $5 / 1M input tokens
  output: 1500 / 1000000, // $15 / 1M output tokens
};
const gpt4oMini = {
  input: 15 / 1000000, // $0.150 / 1M input tokens
  output: 60 / 1000000, // $0.600 / 1M output tokens
};

export const modelCosts: Record<LLMModel, { input: number; output: number }> = {
  // local
  'Llama-3.1-8B-Instruct-q4f16_1-MLC': {
    input: 0, // 0, local
    output: 0, // 0, local
  },
  'Hermes-3-Llama-3.1-8B-q4f16_1-MLC': {
    input: 0, // 0, local
    output: 0, // 0, local
  },
  'Phi-3-mini-128k-instruct-q4f16_1-MLC': {
    input: 0, // 0, local
    output: 0, // 0, local
  },
  'Mistral-7B-Instruct-v0.3-q4f16_0-MLC': {
    input: 0, // 0, local
    output: 0, // 0, local
  },
  'gemma-2-27b-it-q4f32_1-MLC': {
    input: 0, // 0, local
    output: 0, // 0, local
  },
  'gemma-2-9b-it-q4f16_1-MLC': {
    input: 0, // 0, local
    output: 0, // 0, local
  },
  // anthropic
  'claude-3-5-sonnet-20240620': {
    input: 300 / 1000000, // $3 / MTok
    output: 1500 / 1000000, // $15 / MTok
  },
  'claude-3-opus-20240229': {
    input: 1500 / 1000000, // $15 / MTok
    output: 7500 / 1000000, // $75 / MTok
  },
  'claude-3-haiku-20240307': {
    input: 25 / 1000000, // $0.25 / MTok
    output: 125 / 1000000, // $1.25 / MTok
  },
  // gemini
  'gemini-1.5-flash-latest': {
    input: 7.5 / 1000000, // $0.075 / 1 million tokens
    output: 30 / 1000000, // $0.30 / 1 million tokens
  },
  'gemini-1.5-flash': {
    input: 7.5 / 1000000, // $0.075 / 1 million tokens
    output: 30 / 1000000, // $0.30 / 1 million tokens
  },
  'gemini-1.5-pro-latest': {
    input: 350 / 1000000, // $3.50 / 1 million tokens
    output: 1050 / 1000000, // $10.50 / 1 million tokens
  },
  'gemini-1.5-pro': {
    input: 350 / 1000000, // $3.50 / 1 million tokens
    output: 1050 / 1000000, // $10.50 / 1 million tokens
  },
  // openai
  'o1-preview': gpto1pre,
  'o1-mini': gpto1mini,
  'gpt-4o': gpt4o,
  'gpt-4o-2024-05-13': gpt4o,
  'gpt-4o-2024-08-06': gpt4o,
  'gpt-4o-mini': gpt4oMini,
  'gpt-4o-mini-2024-07-18': gpt4oMini,
};
