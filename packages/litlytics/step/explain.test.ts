import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import { generateCodeExplain } from './explain';

const testResult = `Test result explanation`;

test('should explain code', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  // mock prompt
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    expect(user).toEqual('test code');
    return { result: testResult, usage: {} as LanguageModelUsage };
  };
  const result = await generateCodeExplain({
    litlytics,
    code: 'test code',
  });
  expect(result).toEqual(testResult);
});
