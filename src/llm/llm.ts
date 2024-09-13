import { type CompletionResponse, TokenJS } from 'token.js';
import { LLMProvider } from 'token.js/dist/chat';
import { LLMRequest } from './types';

// Create the Token.js client
const tokenjs = new TokenJS();

function setKey(provider: LLMProvider, key: string) {
  // OpenAI
  switch (provider) {
    case 'openai':
      process.env.OPENAI_API_KEY = key;
      break;
    case 'ai21':
      process.env.AI21_API_KEY = key;
      break;
    case 'anthropic':
      process.env.ANTHROPIC_API_KEY = key;
      break;
    case 'cohere':
      process.env.COHERE_API_KEY = key;
      break;
    case 'gemini':
      process.env.GEMINI_API_KEY = key;
      break;
    case 'groq':
      process.env.GROQ_API_KEY = key;
      break;
    case 'mistral':
      process.env.MISTRAL_API_KEY = key;
      break;
    case 'perplexity':
      process.env.PERPLEXITY_API_KEY = key;
      break;
    case 'openrouter':
      process.env.OPENROUTER_API_KEY = key;
      break;
    case 'bedrock': {
      const [region, id, access] = key.split('||');
      process.env.AWS_REGION_NAME = region.trim();
      process.env.AWS_ACCESS_KEY_ID = id.trim();
      process.env.AWS_SECRET_ACCESS_KEY = access.trim();
      break;
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
  setKey(provider, key);
  // run llm
  const chatCompletion = (await tokenjs.chat.completions.create({
    provider,
    model,
    ...modelArgs,
    messages,
  })) as CompletionResponse;
  const answers = chatCompletion.choices;
  const usage = chatCompletion.usage;
  if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'test') {
    console.log('\n\n');
    console.log(
      model,
      messages,
      answers.map((a) => a.message)
    );
    console.log('\n\n');
  }
  const result = answers[0].message.content;
  return { result, answers, usage };
}
