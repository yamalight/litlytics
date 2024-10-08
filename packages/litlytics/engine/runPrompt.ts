import type { LLMProviders } from '@/litlytics';
import { executeOnLLM } from '@/llm/llm';
import type { LLMModel, LLMProvider, LLMRequest } from '@/llm/types';
import { runWithWebLLM } from '@/webllm/webllm.client';
import type { MLCEngine } from '@mlc-ai/web-llm';
import type { CoreMessage, CoreTool } from 'ai';

export interface RunPromptFromMessagesArgs {
  provider: LLMProviders;
  key: string;
  model: LLMModel;
  engine?: MLCEngine;
  messages: CoreMessage[];
  args?: Record<string, CoreTool>;
}
export const runPromptFromMessages = async ({
  provider,
  key,
  model,
  engine,
  messages,
  args,
}: RunPromptFromMessagesArgs) => {
  // execute locally
  if (provider === 'local') {
    return runWithWebLLM({ engine, messages, args });
  }

  const req: LLMRequest = {
    provider: provider as LLMProvider,
    key,
    model,
    messages,
    modelArgs: {
      ...(args ?? {}),
    },
  };
  const res = await executeOnLLM(req);
  return res;
};

export interface RunPromptArgs {
  provider: LLMProviders;
  key: string;
  model: LLMModel;
  engine?: MLCEngine;
  system: string;
  user: string;
  args?: Record<string, CoreTool>;
}
export const runPrompt = async ({
  provider,
  key,
  model,
  engine,
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
  return runPromptFromMessages({
    provider,
    key,
    model,
    engine,
    messages,
    args,
  });
};
