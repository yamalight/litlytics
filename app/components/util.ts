import { executeOnLLM } from '../api/llm/llm';

export const runPrompt = async ({
  system,
  user,
  args,
}: {
  system: string;
  user: string;
  args?: { max_tokens?: number; temperature?: number };
}) => {
  // generate plan from LLM
  const result = await fetch('/api/llm', {
    method: 'POST',
    body: JSON.stringify({ system, user, args }),
  });
  if (!result.ok) {
    throw new Error('Error executing query: ' + (await result.text()));
  }
  const res = (await result.json()) as ReturnType<typeof executeOnLLM>;
  return res;
};
