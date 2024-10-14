import type { Doc } from '../../doc/Document';
import { OUTPUT_ID } from '../../output/Output';
import type { Pipeline } from '../../pipeline/Pipeline';
import type { ProcessingStep, SourceStep } from '../../step/Step';

// steps
export const firstStep: ProcessingStep = {
  id: 'test',
  name: 'test',
  description: 'test',
  connectsTo: ['second'],
  type: 'llm',
  prompt: `first`,
  input: 'doc',
};
export const secondStep: ProcessingStep = {
  id: 'second',
  name: 'second',
  description: 'second',
  connectsTo: [OUTPUT_ID],
  type: 'code',
  code: `export default function test(input) {return input + ' second';}`,
  input: 'result',
};
export const allSteps: ProcessingStep[] = [firstStep, secondStep];
// docs
export const doc: Doc = {
  id: 'test',
  name: 'test',
  content: 'test doc',
  test: true,
  processingResults: [],
};
export const docSecond: Doc = {
  id: 'second',
  name: 'second',
  content: 'second doc',
  processingResults: [],
};
export const allDocs: Doc[] = [doc, docSecond];
// source
export const source: SourceStep = {
  id: 'source',
  name: 'source',
  description: 'source',
  connectsTo: ['test'],
  type: 'source',
  sourceType: 'docs',
  docs: allDocs,
  config: {},
};

// pipeline
export const pipeline: Pipeline = {
  name: 'test',
  pipelineDescription: 'test',
  pipelinePlan: 'test',
  source,
  steps: allSteps,
  provider: 'test',
  model: 'test',
};
