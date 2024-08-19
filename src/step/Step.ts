import { CompletionUsage } from 'openai/resources/completions.mjs';

export interface StepResult {
  stepId: string;
  result: string;
  usage?: CompletionUsage;
}

export type StepType = 'code' | 'llm';

// whether step input is full document, previous processing result or all docs
export type StepInput = 'doc' | 'result' | 'aggregate';

export interface Step {
  id: string;
  name: string;
  description: string;
  type: StepType;
  input: StepInput;
  prompt?: string;
  code?: string;
}
