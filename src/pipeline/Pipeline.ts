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
  results?: Doc[] | Doc;
}
