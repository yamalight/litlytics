import type { Doc } from '../doc/Document';
import type { Result } from '../output/Output';
import type { ProcessingStep, SourceStep } from '../step/Step';

export interface Pipeline {
  name: string;
  pipelineDescription?: string;
  pipelinePlan?: string;
  source: SourceStep;
  resultDocs?: Doc[];
  results?: Result[];
  steps: ProcessingStep[];
  provider?: string;
  model?: string;
}

export interface PipelineStatus {
  status: 'init' | 'refine' | 'sourcing' | 'step' | 'done' | 'error';
  currentStep?: ProcessingStep;
  error?: Error;
}

export const emptyPipeline: Pipeline = {
  // project setup
  name: '',
  // pipeline plan
  pipelinePlan: '',
  pipelineDescription: '',
  // pipeline source
  source: {
    id: 'source_0',
    name: 'Source',
    description: 'Primary source',
    type: 'source',
    sourceType: 'text',
    docs: [],
    connectsTo: [],
    config: {},
    expanded: true,
  },
  // pipeline steps
  steps: [],
};
