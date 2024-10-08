import type { UIComponents } from '../components/types';
import type { Doc } from '../doc/Document';
import type { Pipeline } from '../pipeline/Pipeline';
import type { StepResult } from '../step/Step';

export class OutputTypes {
  static BASIC = 'basic' as const;
}

type OutputTypeList = (typeof OutputTypes)[keyof typeof OutputTypes];

// Ensure SourceType is recognized as a string
export type OutputType = Extract<OutputTypeList, string>;

export abstract class OutputProvider {
  abstract pipeline: Pipeline;
  constructor(_pipeline: Pipeline) {}
  abstract getConfig(): object;
  abstract saveResults(docs: Doc[]): void;
  abstract getResult(): Result[];
  abstract render: ({
    pipeline,
    setPipeline,
    components,
  }: {
    pipeline: Pipeline;
    setPipeline: (newPipe: Pipeline) => void;
    components: UIComponents;
  }) => React.ReactElement;
}

export interface Result extends StepResult {
  doc: Doc;
}
