import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { executeOnLLM } from '../llm/llm';

export const runPromptFromMessages = async ({
  messages,
  args,
}: {
  messages: ChatCompletionMessageParam[];
  args?: { max_tokens?: number; temperature?: number };
}) => {
  // generate plan from LLM
  const result = await fetch('/api/llm', {
    method: 'POST',
    body: JSON.stringify({ messages, args }),
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
  // run on LLM
  return runPromptFromMessages({ messages, args });
};
