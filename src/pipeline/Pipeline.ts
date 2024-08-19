import { Doc } from '../doc/Document';
import { Step } from '../step/Step';

export interface Pipeline {
  name: string;
  documents: Doc[];
  pipelineDescription?: string;
  pipelinePlan?: string;
  steps: Step[];
}
