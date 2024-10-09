import { expect, test } from 'vitest';
import type { LitLytics } from '../../litlytics';
import type { ProcessingStep } from '../../step/Step';
import { allDocs, doc, docSecond, source } from '../../test/testPipeline';
import { runLLMStep } from './runLLMStep';

// steps
const firstStep: ProcessingStep = {
  id: 'test',
  name: 'test',
  description: 'test',
  connectsTo: ['second'],
  type: 'llm',
  prompt: 'test prompt',
  input: 'doc',
};
const secondStep: ProcessingStep = {
  id: 'second',
  name: 'second',
  description: 'second',
  connectsTo: ['third'],
  type: 'llm',
  prompt: 'second prompt',
  input: 'result',
};
const thirdStep: ProcessingStep = {
  id: 'third',
  name: 'third',
  description: 'third',
  connectsTo: [],
  type: 'llm',
  prompt: 'third prompt',
  input: 'aggregate-docs',
};
const allSteps: ProcessingStep[] = [firstStep, secondStep, thirdStep];

test('Should run LLM step on document', async () => {
  let systemPrompt = '';
  let userPrompt = '';
  const litlytics = {
    async runPrompt({ system, user }: { system: string; user: string }) {
      systemPrompt = system;
      userPrompt = user;
      return { result: 'test result' };
    },
  } as unknown as LitLytics;
  const res = await runLLMStep({
    litlytics,
    step: firstStep,
    source,
    doc,
    allDocs,
    allSteps,
  });
  expect(res).toBeDefined();
  expect(res?.processingResults).toHaveLength(1);
  expect(systemPrompt).toEqual(firstStep.prompt);
  expect(userPrompt).toEqual(doc.content);
});

test('Should run LLM step on result', async () => {
  let systemPrompt = '';
  let userPrompt = '';
  const litlytics = {
    async runPrompt({ system, user }: { system: string; user: string }) {
      systemPrompt = system;
      userPrompt = user;
      return { result: 'test result 2' };
    },
  } as unknown as LitLytics;
  const res = await runLLMStep({
    litlytics,
    step: secondStep,
    source,
    doc,
    allDocs,
    allSteps,
  });
  expect(res).toBeDefined();
  expect(systemPrompt).toEqual(secondStep.prompt);
  expect(userPrompt).toEqual('test result');
});

test('Should run LLM step on all docs', async () => {
  let systemPrompt = '';
  let userPrompt = '';
  const litlytics = {
    async runPrompt({ system, user }: { system: string; user: string }) {
      systemPrompt = system;
      userPrompt = user;
      return { result: 'test result 3' };
    },
  } as unknown as LitLytics;
  const res = await runLLMStep({
    litlytics,
    step: thirdStep,
    source,
    doc,
    allDocs,
    allSteps,
  });
  expect(res).toBeDefined();
  expect(systemPrompt).toEqual(thirdStep.prompt);
  expect(userPrompt).toEqual(doc.content + '\n------\n' + docSecond.content);
});
