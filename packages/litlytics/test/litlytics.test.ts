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
  const exportedConfig = litlytics.exportConfig();
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
  await litlytics.runPipeline();
  expect(systemPrompt).toEqual(firstStep.prompt);
  expect(userPrompt).toEqual(docSecond.content);
  expect(litlytics.pipeline.results).toHaveLength(2);
  expect(litlytics.pipeline.results?.[0].result).toEqual(
    'test doc result second'
  );
  expect(litlytics.pipeline.results?.[1].result).toEqual(
    'second doc result second'
  );
});
