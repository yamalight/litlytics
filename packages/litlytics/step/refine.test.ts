import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import type { RunPromptFromMessagesArgs } from '../engine/runPrompt';
import { LitLytics } from '../litlytics';
import { firstStep, secondStep } from '../test/data/testPipeline';
import { refineStep } from './refine';

const testPrompt = `Test prompt`;
const testCode = `export default function test(t) {return t;}`;
const testCodeExplanation = 'Test explanation';

test('should refine llm step', async () => {
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
    return { result: testPrompt, usage: {} as LanguageModelUsage };
  };
  const result = await refineStep({
    litlytics,
    refineRequest: 'test request',
    step: firstStep,
  });
  expect(result).toEqual({
    ...firstStep,
    prompt: testPrompt,
  });
});

test('should refine code step', async () => {
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
    return { result: testCode, usage: {} as LanguageModelUsage };
  };
  // mock explain prompt
  litlytics.runPrompt = async () => {
    return { result: testCodeExplanation, usage: {} as LanguageModelUsage };
  };
  const result = await refineStep({
    litlytics,
    refineRequest: 'test request',
    step: secondStep,
  });
  expect(result).toEqual({
    ...secondStep,
    code: testCode,
    codeExplanation: testCodeExplanation,
  });
});
