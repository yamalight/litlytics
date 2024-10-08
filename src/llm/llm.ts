import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { LLMRequest, ModelConfig } from './types';

function getModel({ provider, model, apiKey, baseURL }: ModelConfig) {
  if (
    !provider?.length ||
    !model?.length ||
    (provider === 'local' && !apiKey?.length)
  )
    return new Error('No provider, model or key set!');

  // OpenAI
  switch (provider) {
    case 'openai': {
      const openai = createOpenAI({
        apiKey: apiKey,
        ...(baseURL ? { baseURL } : {}),
      });
      return openai(model);
    }
    case 'anthropic': {
      const anthropic = createAnthropic({
        apiKey: apiKey,
        headers: {
          // allow in-browser execution
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        ...(baseURL ? { baseURL } : {}),
      });
      return anthropic(model);
    }
    case 'gemini': {
      const google = createGoogleGenerativeAI({
        apiKey: apiKey,
        ...(baseURL ? { baseURL } : {}),
      });
      return google(model, {
        // disable all safety blockers as they tend to mess with data analysis
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
        ],
      });
    }
    case 'ollama': {
      if (!baseURL) return new Error('No custom URL provided');
      if (!baseURL.endsWith('/api'))
        baseURL += !baseURL.endsWith('/') ? '/api' : 'api';
      const ollama = createOllama({
        baseURL,
      });
      return ollama(model);
    }
  }
}

/**
 * Executes LLM prompt and returns a single result
 */
export async function executeOnLLM({
  modelConfig,
  messages,
  modelArgs,
}: LLMRequest) {
  // set key
  const model = getModel(modelConfig);
  if (model instanceof Error) return model;
  if (!model) return new Error('Invalid model config');

  const { text, usage } = await generateText({
    maxTokens: 4096,
    ...modelArgs,
    model,
    messages,
  });

  if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'test') {
    console.log('\n\n');
    console.log(modelConfig.model, messages, text);
    console.log('\n\n');
  }

  return { result: text, usage };
}
