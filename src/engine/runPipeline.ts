import { Doc } from '../doc/Document';
import { Pipeline } from '../pipeline/Pipeline';
import { getBasicSourceDocuments } from '../source/basic';
import { SourceTypes } from '../source/Source';
import { ProcessingStep, SourceStep } from '../step/Step';
import { runStep } from './runStep';

export async function runPipeline(pipeline: Pipeline) {
  // find all sources
  const sources = pipeline.steps.filter((s) => s.type === 'source');
  // validate
  if (sources.length === 0) {
    throw new Error('At least one source required!');
  }
  if (sources.length > 1) {
    throw new Error('Only one source supported!');
  }
  // get first source
  const source = sources[0] as SourceStep;
  console.log(source);

  // get all documents from the source
  let finalResult: Doc[] | undefined = undefined;
  let docs: Doc[] = [];
  switch (source.sourceType) {
    case SourceTypes.BASIC:
      docs = await getBasicSourceDocuments(source);
      break;
    default:
      throw new Error('Unknown source type! Cannot get documents');
  }

  // get all connections to source
  let stepIds = source.connectsTo;
  // find all connected steps
  let nextSteps: ProcessingStep[] = pipeline.steps.filter((s) =>
    stepIds.includes(s.id)
  ) as ProcessingStep[];
  // while there are follow-up steps - continue;
  while (nextSteps.length > 0) {
    // reset final results as we are now working with new steps
    finalResult = [];

    for (const nextStep of nextSteps) {
      // process docs using current step
      // if it's a basic doc/result step - process all docs with it
      if (nextStep.input === 'doc' || nextStep.input === 'result') {
        await Promise.all(
          docs.map((doc) =>
            runStep({
              step: nextStep,
              allSteps: pipeline.steps,
              doc,
              allDocs: docs,
            })
          )
        );
        docs = docs.filter((d) => d !== undefined);
        finalResult = finalResult.concat(
          docs.filter((d) => !finalResult?.find((doc) => doc.id === d.id))
        );
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
        aggregateResult = (await runStep({
          step: nextStep!,
          allSteps: pipeline.steps,
          doc: aggregateResult,
          allDocs: docs,
        })) as Doc;
        docs.push(aggregateResult);
        finalResult.push(aggregateResult);
      }
    }
    // get next step and continue
    stepIds = nextSteps.map((s) => s.connectsTo).flat();
    nextSteps = pipeline.steps.filter((s) =>
      stepIds.includes(s.id)
    ) as ProcessingStep[];
  }

  console.log(docs);
  console.log(finalResult);

  // save result to pipeline
  pipeline.results = finalResult;
  return pipeline;
}
