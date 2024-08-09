import OpenAI from 'openai';
import type {
  ChatCompletion,
  ChatCompletionCreateParams,
  ChatCompletionCreateParamsBase,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';
import type { ChatCompletionMessageParam } from 'openai/resources/index';
import pRetry from 'p-retry';
import { defaultModelArgs, defaultModelName } from './config';

export const openai = new OpenAI({
  maxRetries: 3,
  timeout: 10000, // 10s
  apiKey: process.env.OPENAI_API_KEY ?? 'not-set',
  // override default fetch function to make it mockable my MSW for tests
  fetch: (...args) => fetch(...args),
});

async function executeOpenaiWithFallback(
  args: ChatCompletionCreateParams
): Promise<ChatCompletion> {
  const res = (await openai.chat.completions.create(args)) as ChatCompletion;
  return res;
}

/**
 * Executes LLM prompt and returns all results
 */
async function executeOnLLMBase({
  messages,
  modelName,
  modelArgs,
}: {
  messages: ChatCompletionMessageParam[];
  modelName?: string | null;
  modelArgs?: Partial<ChatCompletionCreateParamsBase>;
}) {
  const chatCompletion = await executeOpenaiWithFallback({
    ...defaultModelArgs,
    ...modelArgs,
    model: modelName ?? defaultModelName,
    messages,
  });
  const answers = chatCompletion.choices;
  const usage = chatCompletion.usage;
  if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'test') {
    console.log('\n\n');
    console.log(chatCompletion.system_fingerprint);
    console.log(
      modelName ?? defaultModelName,
      messages,
      answers.map((a) => a.message)
    );
    console.log('\n\n');
  }
  return { answers, usage };
}

/**
 * Executes LLM prompt with tools and returns all results
 */
async function executeOnLLMToolsBase({
  messages,
  modelName,
  modelArgs,
  tools,
}: {
  messages: ChatCompletionMessageParam[];
  tools: ChatCompletionTool[];
  modelName?: string | null;
  modelArgs?: Partial<ChatCompletionCreateParamsBase>;
}) {
  const chatCompletion = await executeOpenaiWithFallback({
    ...defaultModelArgs,
    ...modelArgs,
    model: modelName ?? defaultModelName,
    messages,
    tools,
    tool_choice: 'auto',
  });
  const answers = chatCompletion.choices;
  const usage = chatCompletion.usage;
  if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'test') {
    console.log('\n\n');
    console.log(
      modelName ?? defaultModelName,
      messages,
      answers.map((a) =>
        a.message.tool_calls
          ? a.message.tool_calls.map((c) => c.function)
          : a.message
      )
    );
    console.log('\n\n');
  }
  return { answers, usage };
}

/**
 * Executes LLM prompt and returns a single result
 */
async function executeOnLLMSingleBase({
  messages,
  modelName,
  modelArgs,
}: {
  messages: ChatCompletionMessageParam[];
  modelName?: string | null;
  modelArgs?: Partial<ChatCompletionCreateParamsBase>;
}) {
  const { answers, usage } = await executeOnLLMBase({
    messages,
    modelName,
    modelArgs,
  });
  const result = answers[0].message.content;
  return { result, usage };
}

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
  return pRetry(
    () => executeOnLLMSingleBase({ messages, modelName, modelArgs }),
    {
      retries: 3,
      shouldRetry: () => true, // always retry
    }
  );
}

/**
 * Executes LLM prompt with tools and returns a single result
 */
export async function executeOnLLMWithTools({
  messages,
  modelName,
  modelArgs,
  tools,
}: {
  messages: ChatCompletionMessageParam[];
  tools: ChatCompletionTool[];
  modelName?: string | null;
  modelArgs?: Partial<ChatCompletionCreateParamsBase>;
}) {
  return pRetry(
    () => executeOnLLMToolsBase({ messages, tools, modelName, modelArgs }),
    {
      retries: 3,
      shouldRetry: () => true, // always retry
    }
  );
}

/**
 * Executes LLM prompt and returns all results
 */
export async function executeOnLLMMulti({
  messages,
  modelName,
  modelArgs,
}: {
  messages: ChatCompletionMessageParam[];
  modelName?: string | null;
  modelArgs?: Partial<ChatCompletionCreateParamsBase>;
}) {
  return pRetry(() => executeOnLLMBase({ messages, modelName, modelArgs }), {
    retries: 3,
    shouldRetry: () => true, // always retry
  });
}
