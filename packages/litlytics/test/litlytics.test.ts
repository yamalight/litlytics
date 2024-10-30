import type { LanguageModelUsage } from 'ai';
import { expect, test, vi } from 'vitest';
import * as run from '../engine/runPrompt';
import {
  LitLytics,
  OUTPUT_ID,
  type Doc,
  type LLMArgs,
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

test('should generate suggested tasks for current pipeline', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  const doc: Doc = {
    id: '0',
    name: 'test',
    content: 'test doc',
    processingResults: [],
    test: true,
  };
  const docNonTest: Doc = {
    id: '1',
    name: 'non-test',
    content: 'non test doc',
    processingResults: [],
  };
  litlytics.setDocs([doc, docNonTest]);
  // mock prompt replies
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    if (user === doc.content) {
      return { result: 'test summary', usage: {} as LanguageModelUsage };
    }

    return { result: '- test tasks', usage: {} as LanguageModelUsage };
  };
  // execute pipeline
  const newPipeline = await litlytics.suggestTasks();
  // validate pipeline
  expect(newPipeline).toBeDefined();
  expect(newPipeline.pipelineTasks?.at(0)).toEqual('test tasks');
  // validate docs
  const newTestDoc = litlytics.docs.find((d) => d.id === doc.id);
  expect(newTestDoc?.summary).toEqual('test summary');
  const newNonTestDoc = litlytics.docs.find((d) => d.id === docNonTest.id);
  expect(newNonTestDoc?.summary).toBeUndefined();
});

test('should pass llm args when running prompt', async () => {
  const testArgs: LLMArgs = {
    temperature: 0.5,
    maxTokens: 1000,
  };
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
    llmArgs: testArgs,
  });
  litlytics.pipeline.pipelineDescription = 'test description';

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

  // mock prompt replies
  const spy = vi
    .spyOn(run, 'runPrompt')
    .mockImplementation(
      async ({
        user,
        args,
      }: {
        system: string;
        user: string;
        args?: LLMArgs;
      }) => {
        expect(args).toEqual(testArgs);
        expect(user).toEqual('test description');
        return { result: testResult, usage: {} as LanguageModelUsage };
      }
    );
  // run generation
  await litlytics.generatePipeline();
  // check that spy was called
  expect(spy).toHaveBeenCalled();
  // cleanup
  spy.mockClear();
});
