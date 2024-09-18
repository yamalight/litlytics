import { MLCEngine } from '@mlc-ai/web-llm';
import { CoreMessage, CoreTool } from 'ai';
import type { LLMProviders } from '../litlytics';
import { executeOnLLM } from '../llm/llm';
import { LLMModel, LLMProvider, LLMRequest } from '../llm/types';
import { runWithWebLLM } from '../webllm/webllm.client';

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
  // generate plan from LLM
  const result = await fetch(`${process.env.DEPLOY_URL}/api/llm`, {
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
