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
  // cohere
  'command-r-plus': {
    input: 250 / 1000000, // $2.50 / 1M tokens
    output: 1000 / 1000000, // $10.00 / 1M tokens
  },
  'command-r': {
    input: 15 / 1000000, // $0.15 / MTok
    output: 60 / 1000000, // $0.60 / MTok
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
  // groq
  'llama-3.1-8b-instant': {
    input: 5 / 1000000, // 	$0.05 / MTok
    output: 8 / 1000000, // $0.08 / MTok
  },
  'llama-3.1-70b-versatile': {
    input: 59 / 1000000, // $0.59 / MTok
    output: 79 / 1000000, // $0.79 / MTok
  },
  'llama3-groq-70b-8192-tool-use-preview': {
    input: 89 / 1000000, // $0.89 / MTok
    output: 89 / 1000000, // $0.89 / MTok
  },
  'mixtral-8x7b-32768': {
    input: 24 / 1000000, // $0.24 / MTok
    output: 24 / 1000000, // $0.24 / MTok
  },
  'gemma-7b-it': {
    input: 7 / 1000000, // $0.07 / MTok
    output: 7 / 1000000, // $0.07 / MTok
  },
  'gemma2-9b-it': {
    input: 20 / 1000000, // 	$0.20 / MTok
    output: 20 / 1000000, // $0.20 / MTok
  },
  // mistral
  'open-mistral-7b': {
    input: 25 / 1000000, // $0.25 / MTok
    output: 25 / 1000000, // $0.25 / MTok
  },
  'open-mixtral-8x7b': {
    input: 70 / 1000000, // $0.7 / MTok
    output: 70 / 1000000, // $0.7 / MTok
  },
  'open-mixtral-8x22b': {
    input: 200 / 1000000, // $2 / MTok
    output: 600 / 1000000, // $6 / MTok
  },
  'open-mistral-nemo': {
    input: 30 / 1000000, // $0.3 / MTok
    output: 30 / 1000000, // $0.3 / MTok
  },
  'mistral-small-latest': {
    input: 100 / 1000000, // $1 / MTok
    output: 300 / 1000000, // $3 / MTok
  },
  'mistral-medium-latest': {
    input: 275 / 1000000, // $2.75 / MTok
    output: 810 / 1000000, // $8.1 / MTok
  },
  'mistral-large-latest': {
    input: 300 / 1000000, // $3 / MTok
    output: 900 / 1000000, // $9 / MTok
  },
  // openai
  'o1-preview': gpto1pre,
  'o1-mini': gpto1mini,
  'gpt-4o': gpt4o,
  'gpt-4o-2024-05-13': gpt4o,
  'gpt-4o-2024-08-06': gpt4o,
  'gpt-4o-mini': gpt4oMini,
  'gpt-4o-mini-2024-07-18': gpt4oMini,
  // perplexity
  'llama-3.1-sonar-large-128k-chat': {
    input: 100 / 1000000, // $1 / MTok
    output: 100 / 1000000, // $1 / MTok
  },
  'llama-3.1-sonar-small-128k-chat': {
    input: 20 / 1000000, // $0.2 / MTok
    output: 20 / 1000000, // $0.2 / MTok
  },
  'llama-3.1-8b-instruct': {
    input: 20 / 1000000, // $0.2 / MTok
    output: 20 / 1000000, // $0.2 / MTok
  },
  'llama-3.1-70b-instruct': {
    input: 100 / 1000000, // $1 / MTok
    output: 100 / 1000000, // $1 / MTok
  },
};
