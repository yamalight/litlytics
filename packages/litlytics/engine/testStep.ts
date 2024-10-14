import type { LitLytics } from '../litlytics';
import type { Pipeline } from '../pipeline/Pipeline';
import type { ProcessingStep } from '../step/Step';
import { runCodeStep } from './step/runCodeStep';

export async function testPipelineStep({
  litlytics,
  pipeline,
  step,
  docId,
}: {
  litlytics: LitLytics;
  pipeline: Pipeline;
  step: ProcessingStep;
  docId: string;
}) {
  const allDocs = pipeline.source.docs;
  const testDocs = allDocs.filter((d) => d.test);
  const doc = testDocs.find((d) => d.id === docId);
  if (
    !doc &&
    step.input !== 'aggregate-docs' &&
    step.input !== 'aggregate-results'
  ) {
    throw new Error('Pipeline test execution error: doc not found!');
  }

  // llm execution
  if (step.type === 'llm') {
    return litlytics.runLLMStep({
      step,
      source: pipeline.source,
      allSteps: pipeline.steps,
      doc: doc!,
      allDocs: testDocs,
    });
  }

  return runCodeStep({
    step,
    source: pipeline.source,
    allSteps: pipeline.steps,
    doc: doc!,
    allDocs: testDocs,
  });
}
