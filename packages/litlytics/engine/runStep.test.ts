import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import {
  allDocs,
  allSteps,
  doc,
  firstStep,
  secondStep,
  source,
} from '../test/testPipeline';
import { runStep } from './runStep';

test('should run llm step', async () => {
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
  const res = await runStep({
    litlytics,
    step: firstStep,
    source,
    allSteps,
    doc,
    allDocs,
  });
  expect(res?.processingResults).toHaveLength(1);
  expect(systemPrompt).toEqual('first');
  expect(userPrompt).toEqual('test doc');
});

test('should run code step', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  const res = await runStep({
    litlytics,
    step: secondStep,
    source,
    allSteps,
    doc,
    allDocs,
  });
  expect(res?.processingResults).toHaveLength(2);
  expect(res?.processingResults[1].result).toEqual('test result second');
});
