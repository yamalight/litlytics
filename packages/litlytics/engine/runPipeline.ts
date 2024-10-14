import type { Doc } from '../doc/Document';
import type { LitLytics } from '../litlytics';
import { getResults } from '../output/getResults';
import { OUTPUT_ID } from '../output/Output';
import type { PipelineStatus } from '../pipeline/Pipeline';

export async function runPipeline(
  litlytics: LitLytics,
  onStatus: (status: PipelineStatus) => void
) {
  const pipeline = structuredClone(litlytics.pipeline);

  // get source
  const source = pipeline.source;
  // validate source
  if (!source) {
    throw new Error('Source is required!');
  }

  // update status
  onStatus({ status: 'sourcing' });

  // get all documents from the source
  const docs: Doc[] = pipeline.source.docs;
  // validate docs
  if (!docs?.length) {
    throw new Error('At least one document is required!');
  }

  // clone docs for execution
  let newDocs: Doc[] = structuredClone(docs);

  // get all connections to source
  let stepIds = source.connectsTo;
  // find all connected steps
  let nextStep = pipeline.steps.find((s) => stepIds.includes(s.id));
  // while there are follow-up steps - continue;
  while (nextStep !== undefined) {
    onStatus({ status: 'step', currentStep: nextStep });
    // process docs using current step
    // if it's a basic doc/result step - process all docs with it
    if (nextStep.input === 'doc' || nextStep.input === 'result') {
      await Promise.all(
        newDocs.map((doc) =>
          litlytics.runStep({
            step: nextStep!,
            source,
            allSteps: pipeline.steps,
            doc,
            allDocs: docs,
          })
        )
      );
      newDocs = newDocs.filter((d) => d !== undefined);
      // if it's an aggregate step - only run it once
    } else if (
      nextStep.input === 'aggregate-docs' ||
      nextStep.input === 'aggregate-results'
    ) {
      let aggregateResult: Doc = {
        id: self.crypto.randomUUID(),
        name: 'Aggregate result',
        content: '',
        processingResults: [],
      };
      aggregateResult = (await litlytics.runStep({
        step: nextStep!,
        source,
        allSteps: pipeline.steps,
        doc: aggregateResult,
        allDocs: docs,
      })) as Doc;
      newDocs.push(aggregateResult);
    }
    // get next step and continue
    stepIds = nextStep.connectsTo;
    // if we're at the output - handle results and break
    if (stepIds.includes(OUTPUT_ID)) {
      // store processed docs
      pipeline.resultDocs = newDocs.filter((doc) => doc);
      // process and store final results
      pipeline.results = getResults(litlytics, newDocs);
      break;
    }
    nextStep = pipeline.steps.find((s) => stepIds.includes(s.id));
  }

  onStatus({ status: 'done' });

  // save result to pipeline
  // pipeline.results = finalResult;
  return pipeline;
}
