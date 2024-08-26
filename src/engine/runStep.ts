import { Doc } from '../doc/Document';
import { ProcessingStep, Step } from '../step/Step';
import { runCodeStep } from './step/runCodeStep';
import { runLLMStep } from './step/runLLMStep';

export async function runStep({
  step,
  allSteps,
  doc,
  allDocs,
}: {
  step: ProcessingStep;
  allSteps: Step[];
  doc: Doc;
  allDocs: Doc[];
}) {
  // llm execution
  if (step.type === 'llm') {
    return runLLMStep({ step, allSteps, doc, allDocs });
  }

  return runCodeStep({ step, allSteps, doc, allDocs });
}
