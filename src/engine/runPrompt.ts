import { CoreMessage, CoreTool } from 'ai';
import type { LLMProviders } from '../litlytics';
import { executeOnLLM } from '../llm/llm';
import { LLMModel, LLMProvider, LLMRequest } from '../llm/types';
// import { runWithWebLLM } from '../webllm/webllm.client';

export interface RunPromptFromMessagesArgs {
  provider: LLMProviders;
  key: string;
  model: LLMModel;
  messages: CoreMessage[];
  args?: Record<string, CoreTool>;
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
  model: LLMModel;
  system: string;
  user: string;
  args?: Record<string, CoreTool>;
}
export const runPrompt = async ({
  provider,
  key,
  model,
  system,
  user,
  args,
}: RunPromptArgs) => {
  const messages: CoreMessage[] = [];
  if (system) {
    messages.push({ role: 'system', content: system.trim() });
  }
  messages.push({ role: 'user', content: user.trim() });
  // return runWithWebLLM({ messages, args });
  // run on LLM
  return runPromptFromMessages({ provider, key, model, messages, args });
};
