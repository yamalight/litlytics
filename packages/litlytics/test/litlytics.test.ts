import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import {
  LitLytics,
  OUTPUT_ID,
  type Pipeline,
  type StepInput,
} from '../litlytics';
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

test('should add new step to pipeline after source', async () => {
  let userPrompt = '';
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.setPipeline(pipeline);
  // mock prompt replies
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    userPrompt = user;
    return { result: `New step prompt`, usage: {} as LanguageModelUsage };
  };
  // execute pipeline
  const newPipeline = await litlytics.addStep({
    step: {
      id: '0',
      name: 'New step',
      description: 'New step',
      type: 'llm',
      input: 'doc' as StepInput,
      connectsTo: [pipeline.steps.at(0)!.id],
    },
    sourceStep: pipeline.source,
  });
  expect(userPrompt).toEqual(`Step name: New step
Step description: New step
Step input: doc`);
  // validate pipeline
  expect(newPipeline).toBeDefined();
  expect(newPipeline?.steps).toHaveLength(3);
  // validate step
  const newStep = newPipeline?.steps?.find((s) => s.name === 'New step');
  expect(newStep?.id).toEqual('step_2');
  expect(newStep?.name).toEqual('New step');
  expect(newStep?.prompt).toEqual('New step prompt');
  // validate connections
  expect(newPipeline.source.connectsTo).toEqual([newStep!.id]);
  expect(newStep?.connectsTo).toEqual([newPipeline.steps.at(0)!.id]);
});

test('should add new step to pipeline after step', async () => {
  let userPrompt = '';
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.setPipeline(pipeline);
  // mock prompt replies
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    userPrompt = user;
    return { result: `New step prompt`, usage: {} as LanguageModelUsage };
  };
  // execute pipeline
  const newPipeline = await litlytics.addStep({
    step: {
      id: '0',
      name: 'New step',
      description: 'New step',
      type: 'llm',
      input: 'doc' as StepInput,
      connectsTo: [pipeline.steps.at(0)!.id],
    },
    sourceStep: pipeline.steps.at(0),
  });
  expect(userPrompt).toEqual(`Step name: New step
Step description: New step
Step input: doc`);
  // validate pipeline
  expect(newPipeline).toBeDefined();
  expect(newPipeline?.steps).toHaveLength(3);
  // validate step
  const newStep = newPipeline?.steps?.find((s) => s.name === 'New step');
  expect(newStep?.id).toEqual('step_2');
  expect(newStep?.name).toEqual('New step');
  expect(newStep?.prompt).toEqual('New step prompt');
  // validate connections
  expect(newPipeline.steps.at(0)!.connectsTo).toEqual([newStep!.id]);
  expect(newStep?.connectsTo).toEqual([newPipeline.steps.at(1)!.id]);
});

test('should add new step to pipeline at the end', async () => {
  let userPrompt = '';
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.setPipeline(pipeline);
  // mock prompt replies
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    userPrompt = user;
    return { result: `New step prompt`, usage: {} as LanguageModelUsage };
  };
  // execute pipeline
  const newPipeline = await litlytics.addStep({
    step: {
      id: '0',
      name: 'New step',
      description: 'New step',
      type: 'llm',
      input: 'doc' as StepInput,
      connectsTo: [],
    },
    sourceStep: pipeline.steps.at(-1),
  });
  expect(userPrompt).toEqual(`Step name: New step
Step description: New step
Step input: doc`);
  // validate pipeline
  expect(newPipeline).toBeDefined();
  expect(newPipeline?.steps).toHaveLength(3);
  // validate step
  const newStep = newPipeline?.steps?.find((s) => s.name === 'New step');
  expect(newStep?.id).toEqual('step_2');
  expect(newStep?.name).toEqual('New step');
  expect(newStep?.prompt).toEqual('New step prompt');
  // validate connections
  expect(newPipeline.steps.at(1)!.connectsTo).toEqual([newStep!.id]);
  expect(newStep?.connectsTo).toEqual([OUTPUT_ID]);
});
