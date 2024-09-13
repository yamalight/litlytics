import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { LLMChatModel, LLMProvider } from 'token.js/dist/chat';
import type { LLMProviders } from '../litlytics';
import { executeOnLLM } from '../llm/llm';
import { LLMRequest } from '../llm/types';
// import { runWithWebLLM } from '../webllm/webllm.client';

export interface RunPromptFromMessagesArgs {
  provider: LLMProviders;
  key: string;
  model: LLMChatModel;
  messages: ChatCompletionMessageParam[];
  args?: { max_tokens?: number; temperature?: number };
}
export const runPromptFromMessages = async ({
  provider,
  key,
  model,
  messages,
  args,
}: RunPromptFromMessagesArgs) => {
  const req: LLMRequest = {
    provider: provider as LLMProvider,
    key,
    model,
    messages,
    modelArgs: {
      ...(args ?? {}),
    },
  };
  // generate plan from LLM
  const result = await fetch('/api/llm', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  if (!result.ok) {
    throw new Error('Error executing query: ' + (await result.text()));
  }
  const res = (await result.json()) as ReturnType<typeof executeOnLLM>;
  return res;
};

export interface RunPromptArgs {
  provider: LLMProviders;
  key: string;
  model: LLMChatModel;
  system: string;
  user: string;
  args?: { max_tokens?: number; temperature?: number };
}
export const runPrompt = async ({
  provider,
  key,
  model,
  system,
  user,
  args,
}: RunPromptArgs) => {
  const messages: ChatCompletionMessageParam[] = [];
  if (system) {
    messages.push({ role: 'system', content: system.trim() });
  }
  messages.push({ role: 'user', content: user.trim() });
  // return runWithWebLLM({ messages, args });
  // run on LLM
  return runPromptFromMessages({ provider, key, model, messages, args });
};
