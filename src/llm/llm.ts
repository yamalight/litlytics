import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { LLMModel, LLMProvider, LLMRequest } from './types';

function getModel({
  provider,
  model,
  key,
}: {
  provider: LLMProvider;
  model: LLMModel;
  key: string;
}) {
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
        headers: {
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      });
      return anthropic(model);
    }
    case 'gemini': {
      const google = createGoogleGenerativeAI({
        apiKey: key,
      });
      return google(model, {
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
      const ollama = createOllama({
        baseURL: `${key}${key.endsWith('/') ? '' : '/'}api`,
      });
      return ollama(model);
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
  const modelObj = getModel({ provider, model, key });
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
