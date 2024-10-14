import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import { generateStep } from './generate';

const testPrompt = `Test prompt`;
const testCode = `export default function test(t) {return t;}`;
const testCodeExplanation = 'Test explanation';

test('should generate llm step', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  // mock prompt
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    expect(user).toEqual(`Step name: Step 1
Step description: Step 1 desc
Step input: doc`);
    return { result: testPrompt, usage: {} as LanguageModelUsage };
  };
  const result = await generateStep({
    litlytics,
    id: 'step_1',
    name: 'Step 1',
    description: 'Step 1 desc',
    input: 'doc',
    type: 'llm',
  });
  expect(result).toEqual({
    id: 'step_1',
    name: 'Step 1',
    description: 'Step 1 desc',
    input: 'doc',
    type: 'llm',
    prompt: testPrompt,
    code: undefined,
    codeExplanation: undefined,
    connectsTo: [],
    expanded: true,
  });
});

test('should generate code step', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  // mock prompt
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    if (user.includes('Step 2')) {
      return { result: testCode, usage: {} as LanguageModelUsage };
    }
    return { result: testCodeExplanation, usage: {} as LanguageModelUsage };
  };
  const result = await generateStep({
    litlytics,
    id: 'step_2',
    name: 'Step 2',
    description: 'Step 2 desc',
    input: 'doc',
    type: 'code',
  });
  expect(result).toEqual({
    id: 'step_2',
    name: 'Step 2',
    description: 'Step 2 desc',
    input: 'doc',
    type: 'code',
    code: testCode,
    codeExplanation: testCodeExplanation,
    prompt: undefined,
    connectsTo: [],
    expanded: true,
  });
});
