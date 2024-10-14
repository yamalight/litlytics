import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import {
  doc,
  firstStep,
  pipeline,
  secondStep,
} from '../test/data/testPipeline';
import { testPipelineStep } from './testStep';

test('should test llm step', async () => {
  let systemPrompt = '';
  let userPrompt = '';
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  // override prompt execution
  litlytics.runPrompt = async ({
    system,
    user,
  }: {
    system: string;
    user: string;
  }) => {
    systemPrompt = system;
    userPrompt = user;
    return { result: 'test result', usage: {} as LanguageModelUsage };
  };
  const res = await testPipelineStep({
    litlytics,
    step: firstStep,
    pipeline,
    docId: doc.id,
  });
  expect(res?.processingResults).toHaveLength(1);
  expect(systemPrompt).toEqual('first');
  expect(userPrompt).toEqual('test doc');
});

test('should test code step', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  const res = await testPipelineStep({
    litlytics,
    step: secondStep,
    pipeline,
    docId: doc.id,
  });
  expect(res?.processingResults).toHaveLength(2);
  expect(res?.processingResults[1].result).toEqual('test result second');
});
