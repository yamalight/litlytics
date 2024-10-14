import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import { generatePipeline } from './generate';

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

test('should generate pipeline from text', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  // mock step-to-json prompt
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    expect(user).toEqual('test description');
    return { result: testResult, usage: {} as LanguageModelUsage };
  };
  const result = await generatePipeline({
    litlytics,
    description: 'test description',
  });
  expect(result).toEqual(testResult.trim());
});
