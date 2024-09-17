import { Doc } from '../doc/Document';
import { OutputStep, ProcessingStep, SourceStep } from '../step/Step';

export interface Pipeline {
  name: string;
  pipelineDescription?: string;
  pipelinePlan?: string;
  source: SourceStep;
  output: OutputStep;
  steps: ProcessingStep[];
  testDocs: Doc[];
  provider?: string;
  model?: string;
}

export interface PipelineStatus {
  status: 'init' | 'sourcing' | 'step' | 'done' | 'error';
  currentStep?: ProcessingStep;
  error?: Error;
}
