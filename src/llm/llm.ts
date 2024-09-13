import { createAnthropic } from '@ai-sdk/anthropic';
import { createAzure } from '@ai-sdk/azure';
import { createCohere } from '@ai-sdk/cohere';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { LLMModel, LLMProvider, LLMRequest } from './types';

function getModel(provider: LLMProvider, model: LLMModel, key: string) {
  // OpenAI
  switch (provider) {
    case 'openai': {
      const openai = createOpenAI({
        apiKey: key,
      });
      return openai(model);
    }
    case 'anthropic': {
      const anthropic = createAnthropic({
        apiKey: key,
      });
      return anthropic(model);
    }
    case 'gemini': {
      const google = createGoogleGenerativeAI({
        apiKey: key,
      });
      return google(model);
    }
    case 'azure': {
      const azure = createAzure({
        apiKey: key,
      });
      return azure(model);
    }
    case 'cohere': {
      const cohere = createCohere({ apiKey: key });
      return cohere(model);
    }
    case 'mistral': {
      const mistral = createMistral({ apiKey: key });
      return mistral(model);
    }
    case 'groq': {
      const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: key,
      });
      return groq(model);
    }
    case 'perplexity': {
      const perplexity = createOpenAI({
        apiKey: key,
        baseURL: 'https://api.perplexity.ai/',
      });
      return perplexity(model);
    }
  }
}

/**
 * Executes LLM prompt and returns a single result
 */
export async function executeOnLLM({
  provider,
  key,
  model,
  messages,
  modelArgs,
}: LLMRequest) {
  // set key
  const modelObj = getModel(provider, model, key);
  const { text, usage } = await generateText({
    maxTokens: 4096,
    ...modelArgs,
    model: modelObj,
    messages,
  });
  if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'test') {
    console.log('\n\n');
    console.log(model, messages, text);
    console.log('\n\n');
  }
  const result = text;
  return { result, usage };
}
