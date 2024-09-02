import { CompletionUsage } from 'openai/resources/completions.mjs';
import { OutputType } from '../output/Output';
import { SourceType } from '../source/Source';

export interface StepResult {
  stepId: string;
  result?: string;
  usage?: CompletionUsage;
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
  sourceType: SourceType;
  config: any;
}

export interface ProcessingStep extends BaseStep {
  type: ProcessingStepTypes;
  input?: StepInput;
  prompt?: string;
  code?: string;
}

export interface OutputStep extends BaseStep {
  type: OutputStepTypes;
  outputType: OutputType;
  config: any;
}
