import { expect, test } from 'vitest';
import type { ProcessingStep } from '../../step/Step';
import { allDocs, doc, docSecond, source } from '../../test/data/testPipeline';
import { runCodeStep } from './runCodeStep';

// steps
const firstStep: ProcessingStep = {
  id: 'test',
  name: 'test',
  description: 'test',
  connectsTo: ['second'],
  type: 'code',
  code: `export default function test(input) {return input;}`,
  input: 'doc',
};
const secondStep: ProcessingStep = {
  id: 'second',
  name: 'second',
  description: 'second',
  connectsTo: ['third'],
  type: 'code',
  code: `export default function test(input) {return input + ' second';}`,
  input: 'result',
};
const thirdStep: ProcessingStep = {
  id: 'third',
  name: 'third',
  description: 'third',
  connectsTo: [],
  type: 'code',
  code: `export default function test(docs) {return docs.join(' ');}`,
  input: 'aggregate-docs',
};
const allSteps: ProcessingStep[] = [firstStep, secondStep, thirdStep];

test('Should run code step on document', async () => {
  const res = await runCodeStep({
    step: firstStep,
    source,
    doc,
    allDocs,
    allSteps,
  });
  expect(res.processingResults).toHaveLength(1);
  expect(res.processingResults[0].result).toEqual('test doc');
  expect(res.processingResults[0].stepId).toEqual('test');
});

test('Should run code step on result', async () => {
  const res = await runCodeStep({
    step: secondStep,
    source,
    doc,
    allDocs,
    allSteps,
  });
  expect(res.processingResults).toHaveLength(2);
  expect(res.processingResults[1].result).toEqual('test doc second');
  expect(res.processingResults[1].stepId).toEqual('second');
});

test('Should run code step on all docs', async () => {
  const res = await runCodeStep({
    step: thirdStep,
    source,
    doc,
    allDocs,
    allSteps,
  });
  expect(res.processingResults).toHaveLength(3);
  expect(res.processingResults[2].result).toEqual(
    doc.content + ' ' + docSecond.content
  );
  expect(res.processingResults[2].stepId).toEqual('third');
});
