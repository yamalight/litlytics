import { CoreMessage, CoreTool } from 'ai';
import { executeOnLLM } from '../llm/llm';
import { ModelConfig } from '../llm/types';
import { runWithWebLLM } from '../webllm/webllm.client';

export interface RunPromptFromMessagesArgs {
  messages: CoreMessage[];
  modelConfig: ModelConfig;
  args?: Record<string, CoreTool>;
}
export const runPromptFromMessages = async ({
  messages,
  modelConfig,
  args,
}: RunPromptFromMessagesArgs) => {
  // execute locally
  if (modelConfig.provider === 'local')
    return runWithWebLLM({ engine: modelConfig.engine, messages, args });

  return await executeOnLLM({
    messages,
    modelConfig,
    modelArgs: args ?? {},
  });
};

export interface RunPromptArgs {
  modelConfig: ModelConfig;
  system: string;
  user: string;
  args?: Record<string, CoreTool>;
}
export const runPrompt = async ({
  modelConfig,
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
    modelConfig,
    messages,
    args,
  });
};
