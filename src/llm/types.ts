import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs';
import { type ChatCompletionMessageParam } from 'token.js';
import type { LLMChatModel, LLMProvider } from 'token.js/dist/chat';

export interface LLMRequest {
  provider: LLMProvider;
  key: string;
  model: LLMChatModel;
  messages: ChatCompletionMessageParam[];
  modelArgs?: Partial<ChatCompletionCreateParamsBase>;
}
