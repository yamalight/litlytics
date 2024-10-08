import type { StepResult } from '../step/Step';

export interface Doc {
  id: string;
  name: string;
  content: string;
  test?: boolean;
  processingResults: StepResult[];
}
