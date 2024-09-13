import { Doc } from '../doc/Document';
import type { LitLytics } from '../litlytics';
import { Pipeline, PipelineStatus } from '../pipeline/Pipeline';
import { getDocsListSourceDocuments } from '../source/docsList';
import { SourceTypes } from '../source/Source';
import { getTextSourceDocuments } from '../source/textSource';

export async function runPipeline(
  litlytics: LitLytics,
  pipeline: Pipeline,
  onStatus: (status: PipelineStatus) => void
) {
  // get source
  const source = pipeline.source;
  // validate
  if (!source) {
    throw new Error('Source is required!');
  }
  console.log(source);

  // update status
  onStatus({ status: 'sourcing' });

  // get all documents from the source
  let docs: Doc[] = [];
  switch (source.sourceType) {
    case SourceTypes.DOCS:
      docs = await getDocsListSourceDocuments(source);
      break;
    case SourceTypes.TEXT:
      docs = await getTextSourceDocuments(source);
      break;
    default:
      throw new Error('Unknown source type! Cannot get documents');
  }

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
        docs.map((doc) =>
          litlytics.runStep({
            step: nextStep!,
            source,
            allSteps: pipeline.steps,
            doc,
            allDocs: docs,
          })
        )
      );
      docs = docs.filter((d) => d !== undefined);
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
      docs.push(aggregateResult);
    }
    // get next step and continue
    stepIds = nextStep.connectsTo;
    // if we're at the output - handle results and break
    if (stepIds.includes(pipeline.output.id)) {
      pipeline.output.config = {
        results: docs,
      };
      break;
    }
    nextStep = pipeline.steps.find((s) => stepIds.includes(s.id));
  }

  console.log(docs);

  onStatus({ status: 'done' });

  // save result to pipeline
  // pipeline.results = finalResult;
  return pipeline;
}
