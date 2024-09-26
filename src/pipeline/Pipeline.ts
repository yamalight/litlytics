import { Result } from '../output/Output';
import { OutputStep, ProcessingStep, SourceStep } from '../step/Step';

export interface Pipeline {
  name: string;
  pipelineDescription?: string;
  pipelinePlan?: string;
  source: SourceStep;
  output: OutputStep;
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
