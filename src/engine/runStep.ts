import { Doc } from '../doc/Document';
import { ProcessingStep, SourceStep } from '../step/Step';
import { runCodeStep } from './step/runCodeStep';
import { runLLMStep } from './step/runLLMStep';

export async function runStep({
  step,
  source,
  allSteps,
  doc,
  allDocs,
}: {
  step: ProcessingStep;
  source: SourceStep;
  allSteps: ProcessingStep[];
  doc: Doc;
  allDocs: Doc[];
}) {
  console.log({ step, source, allSteps, doc, allDocs });
  // llm execution
  if (step.type === 'llm') {
    return runLLMStep({ step, source, allSteps, doc, allDocs });
  }

  return runCodeStep({ step, source, allSteps, doc, allDocs });
}
