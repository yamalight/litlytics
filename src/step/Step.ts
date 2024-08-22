import { CompletionUsage } from 'openai/resources/completions.mjs';
import { SourceType } from './Source';

export interface StepResult {
  stepId: string;
  result: string;
  usage?: CompletionUsage;
}

// step types
export type SourceStepType = 'source';
export type ProcessingStepTypes = 'code' | 'llm';
export type StepTypes = SourceStepType | ProcessingStepTypes;

// whether step input is full document, previous processing result or all docs
export type StepInput =
  | 'doc'
  | 'result'
  | 'aggregate-docs'
  | 'aggregate-results';

export interface BaseStep extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  type: StepTypes;
  position: { x: number; y: number };
  connectsTo: string[];
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

export type Step = SourceStep | ProcessingStep;
