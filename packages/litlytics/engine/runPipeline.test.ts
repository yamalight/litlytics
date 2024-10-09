import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import type { PipelineStatus } from '../pipeline/Pipeline';
import { docSecond, firstStep, pipeline } from '../test/testPipeline';
import { runPipeline } from './runPipeline';

test('should run basic pipeline', async () => {
  const statuses = [];
  let systemPrompt = '';
  let userPrompt = '';
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.pipeline = pipeline;
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
  const newPipeline = await runPipeline(litlytics, (status: PipelineStatus) =>
    statuses.push(status.status)
  );
  expect(systemPrompt).toEqual(firstStep.prompt);
  expect(userPrompt).toEqual(docSecond.content);
  expect(newPipeline.results).toHaveLength(2);
  expect(newPipeline.results?.[0].result).toEqual('test doc result second');
  expect(newPipeline.results?.[1].result).toEqual('second doc result second');
});
