import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics, type Pipeline } from '../litlytics';
import { docSecond, firstStep, pipeline } from './data/testPipeline';

test('should create new instance and import/export config', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.importConfig({
    provider: 'openai',
    model: 'test1',
    llmKey: 'test1',
    pipeline: {} as Pipeline,
  });
  const exportedConfig = litlytics.config;
  expect(exportedConfig).toEqual({
    // model config
    provider: 'openai',
    model: 'test1',
    llmKey: 'test1',
    // pipeline
    pipeline: {},
  });
});

test('should create new instance and run test pipeline', async () => {
  const statuses: string[] = [];
  let systemPrompt = '';
  let userPrompt = '';
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.setPipeline(pipeline);
  // mock prompt replies
  litlytics.runPrompt = async ({
    system,
    user,
  }: {
    system: string;
    user: string;
  }) => {
    systemPrompt = system;
    userPrompt = user;
    return { result: `${user} result`, usage: {} as LanguageModelUsage };
  };
  // execute pipeline
  const newPipeline = await litlytics.runPipeline({
    onStatus: (s) => statuses.push(s.status),
  });
  expect(systemPrompt).toEqual(firstStep.prompt);
  expect(userPrompt).toEqual(docSecond.content);
  expect(statuses).toEqual(['init', 'sourcing', 'step', 'step', 'done']);
  expect(newPipeline).toBeDefined();
  expect(newPipeline?.results).toHaveLength(2);
  expect(newPipeline?.results?.[0].result).toEqual('test doc result second');
  expect(newPipeline?.results?.[1].result).toEqual('second doc result second');
});
