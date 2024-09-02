import { Pipeline } from '../pipeline/Pipeline';
import { ProcessingStep } from '../step/Step';
import { runCodeStep } from './step/runCodeStep';
import { runLLMStep } from './step/runLLMStep';

export async function testPipelineStep({
  pipeline,
  step,
  docId,
}: {
  pipeline: Pipeline;
  step: ProcessingStep;
  docId: string;
}) {
  const doc = pipeline.testDocs.find((d) => d.id === docId);
  if (
    !doc &&
    step.input !== 'aggregate-docs' &&
    step.input !== 'aggregate-results'
  ) {
    throw new Error('Pipeline test execution error: doc not found!');
  }

  // llm execution
  if (step.type === 'llm') {
    return runLLMStep({
      step,
      source: pipeline.source,
      allSteps: pipeline.steps,
      doc: doc!,
      allDocs: pipeline.testDocs,
    });
  }

  return runCodeStep({
    step,
    source: pipeline.source,
    allSteps: pipeline.steps,
    doc: doc!,
    allDocs: pipeline.testDocs,
  });
}
