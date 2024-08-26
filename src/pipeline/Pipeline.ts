import { Doc } from '../doc/Document';
import { Step } from '../step/Step';

export interface Pipeline {
  name: string;
  pipelineDescription?: string;
  pipelinePlan?: string;
  steps: Step[];
  testDocs: Doc[];
  results?: Doc[] | Doc;
}
