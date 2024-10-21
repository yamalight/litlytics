import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import { suggestTasks } from './suggestTasks';

const testDoc = `This is a test document with some text`;
const testSummary = `This is a test document summary`;
const testResult = `- This is a suggested test task`;

test('should generate task suggestions from pipeline', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.setDocs([
    {
      id: '0',
      name: 'test',
      content: testDoc,
      test: true,
      processingResults: [],
    },
  ]);
  // mock step-to-json prompt
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    if (user === testDoc) {
      return { result: testSummary, usage: {} as LanguageModelUsage };
    }

    return { result: testResult, usage: {} as LanguageModelUsage };
  };
  const result = await suggestTasks({
    litlytics,
    pipeline: litlytics.pipeline,
  });

  expect(result.tasks.at(0)).toEqual(testResult.replace('-', '').trim());
  expect(result.docs.at(0)?.summary).toEqual(testSummary);
});
