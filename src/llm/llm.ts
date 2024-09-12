import OpenAI from 'openai';
import type {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
} from 'openai/resources/chat/completions';
import type { ChatCompletionMessageParam } from 'openai/resources/index';
import { defaultModelArgs, defaultModelName } from './config';

export const openai = new OpenAI({
  maxRetries: 3,
  timeout: 180000, // 180s
  apiKey: process.env.OPENAI_API_KEY ?? 'not-set',
  // override default fetch function to make it mockable my MSW for tests
  fetch: (...args) => fetch(...args),
});

/**
 * Executes LLM prompt and returns a single result
 */
export async function executeOnLLM({
  messages,
  modelName,
  modelArgs,
}: {
  messages: ChatCompletionMessageParam[];
  modelName?: string | null;
  modelArgs?: Partial<ChatCompletionCreateParamsBase>;
}) {
  const chatCompletion = (await openai.chat.completions.create({
    ...defaultModelArgs,
    ...modelArgs,
    model: modelName ?? defaultModelName,
    messages,
  })) as ChatCompletion;
  const answers = chatCompletion.choices;
  const usage = chatCompletion.usage;
  if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'test') {
    console.log('\n\n');
    console.log(
      modelName ?? defaultModelName,
      messages,
      answers.map((a) => a.message)
    );
    console.log('\n\n');
  }
  const result = answers[0].message.content;
  return { result, answers, usage };
}
