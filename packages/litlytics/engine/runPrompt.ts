import type { CoreMessage } from 'ai';
import type { LLMProviders } from '../litlytics';
import { executeOnLLM } from '../llm/llm';
import type { LLMArgs, LLMModel, LLMProvider, LLMRequest } from '../llm/types';

export interface RunPromptFromMessagesArgs {
  provider: LLMProviders;
  key: string;
  model: LLMModel;
  messages: CoreMessage[];
  args?: LLMArgs;
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
  const res = await executeOnLLM(req);
  return res;
};

export interface RunPromptArgs {
  provider: LLMProviders;
  key: string;
  model: LLMModel;
  system: string;
  user: string;
  args?: LLMArgs;
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
  return runPromptFromMessages({
    provider,
    key,
    model,
    messages,
    args,
  });
};
