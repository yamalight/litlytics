import { Doc } from '../doc/Document';
import type { LitLytics } from '../litlytics';
import { ProcessingStep, SourceStep } from '../step/Step';
import { runCodeStep } from './step/runCodeStep';

export interface RunStepArgs {
  litlytics: LitLytics;
  step: ProcessingStep;
  source: SourceStep;
  allSteps: ProcessingStep[];
  doc: Doc;
  allDocs: Doc[];
}
export async function runStep({
  litlytics,
  step,
  source,
  allSteps,
  doc,
  allDocs,
}: RunStepArgs) {
  // console.log({ step, source, allSteps, doc, allDocs });
  // llm execution
  if (step.type === 'llm') {
    return litlytics.runLLMStep({ step, source, allSteps, doc, allDocs });
  }

  return runCodeStep({ step, source, allSteps, doc, allDocs });
}
