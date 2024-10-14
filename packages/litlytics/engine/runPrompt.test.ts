import type { LanguageModelUsage } from 'ai';
import { expect, test, vi } from 'vitest';
import { runPrompt } from './runPrompt';

vi.mock('ai', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('ai')>()),
    // mock generation function
    generateText: () => ({
      text: 'mocked reply',
      usage: {
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0,
      } as LanguageModelUsage,
    }),
  };
});

test('should run prompt', async () => {
  const res = await runPrompt({
    provider: 'openai',
    key: 'test',
    model: 'test',
    system: 'system',
    user: 'user',
  });
  expect(res.result).toEqual('mocked reply');
  expect(res.usage).toEqual({
    completionTokens: 0,
    promptTokens: 0,
    totalTokens: 0,
  });
});
