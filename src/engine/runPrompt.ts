import {
  ChatCompletionMessageParam,
  ResponseFormatJSONObject,
  ResponseFormatJSONSchema,
  ResponseFormatText,
} from 'openai/resources/index.mjs';
import { executeOnLLM } from '../llm/llm';
// import { runWithWebLLM } from '../webllm/webllm.client';

export const runPromptFromMessages = async ({
  messages,
  args,
  response_format,
}: {
  messages: ChatCompletionMessageParam[];
  args?: { max_tokens?: number; temperature?: number };
  response_format?:
    | ResponseFormatText
    | ResponseFormatJSONObject
    | ResponseFormatJSONSchema;
}) => {
  // generate plan from LLM
  const result = await fetch('/api/llm', {
    method: 'POST',
    body: JSON.stringify({ messages, args, response_format }),
  });
  if (!result.ok) {
    throw new Error('Error executing query: ' + (await result.text()));
  }
  const res = (await result.json()) as ReturnType<typeof executeOnLLM>;
  return res;
};

export const runPrompt = async ({
  system,
  user,
  args,
}: {
  system: string;
  user: string;
  args?: { max_tokens?: number; temperature?: number };
}) => {
  const messages: ChatCompletionMessageParam[] = [];
  if (system) {
    messages.push({ role: 'system', content: system.trim() });
  }
  messages.push({ role: 'user', content: user.trim() });
  // return runWithWebLLM({ messages, args });
  // run on LLM
  return runPromptFromMessages({ messages, args });
};
