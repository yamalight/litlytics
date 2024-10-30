import type { LanguageModelUsage } from 'ai';
import type { Doc } from '../doc/Document';
import type { LLMArgs } from '../llm/types';

export interface StepResult {
  stepId: string;
  result?: string;
  usage?: LanguageModelUsage;
  timingMs: number;
}

// step types
export type SourceStepType = 'source';
export type ProcessingStepTypes = 'code' | 'llm';
export type OutputStepTypes = 'output';
export type StepTypes = SourceStepType | ProcessingStepTypes | OutputStepTypes;

// whether step input is full document, previous processing result or all docs
export class StepInputs {
  static DOC = 'doc';
  static RESULT = 'result';
  static AGGREGATE_DOCS = 'aggregate-docs';
  static AGGREGATE_RESULTS = 'aggregate-results';
}
type StepInputList = (typeof StepInputs)[keyof typeof StepInputs];

// Ensure SourceType is recognized as a string
export type StepInput = Extract<StepInputList, string>;

export interface BaseStep extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  type: StepTypes;
  connectsTo: string[];
  expanded?: boolean;
}

export interface SourceStep extends BaseStep {
  type: SourceStepType;
  docs: Doc[];
  config: object;
}

export interface ProcessingStep extends BaseStep {
  type: ProcessingStepTypes;
  input?: StepInput;
  // llm
  prompt?: string;
  llmArgs?: LLMArgs;
  // code
  code?: string;
  codeExplanation?: string;
}
