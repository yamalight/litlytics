import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import type { RunPromptFromMessagesArgs } from '../engine/runPrompt';
import { LitLytics } from '../litlytics';
import { pipeline } from '../test/testPipeline';
import { refinePipeline } from './refine';

const testResult = `Step name: Generate Title and Description
Step type: llm
Step input: doc
Step description: Generate an Etsy product title and description based on the provided document describing the product.

---

Step name: Check for Copyrighted Terms
Step type: llm
Step input: result
Step description: Analyze the generated title and description for possible copyrighted terms and suggest edits.
`;

test('should refine pipeline from request', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  // mock prompt
  litlytics.runPromptFromMessages = async ({
    messages,
  }: Pick<RunPromptFromMessagesArgs, 'messages' | 'args'>) => {
    expect(messages).toHaveLength(4);
    return { result: testResult, usage: {} as LanguageModelUsage };
  };
  const result = await refinePipeline({
    litlytics,
    refineRequest: 'test request',
    pipeline,
  });
  expect(result).toEqual(testResult);
});
