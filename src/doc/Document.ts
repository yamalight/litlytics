import { StepResult } from '../step/Step';

export interface Doc {
  id: string;
  name: string;
  content: string;
  processingResults: StepResult[];
}
