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
  let finalResult: Doc[] | Doc | undefined = undefined;
  let docs: Doc[] = [];
  switch (source.sourceType) {
    case SourceTypes.BASIC:
      docs = await getBasicSourceDocuments(source);
      break;
    default:
      throw new Error('Unknown source type! Cannot get documents');
  }

  let stepId = source.connectsTo.at(0);
  let step: ProcessingStep | undefined = pipeline.steps.find(
    (s) => s.id === stepId
  ) as ProcessingStep | undefined;
  while (step !== undefined) {
    // process docs using current step
    // if it's a basic doc/result step - process all docs with it
    if (step.input === 'doc' || step.input === 'result') {
      const newDocs = await Promise.all(
        docs.map((doc) =>
          runStep({
            step: step!,
            allSteps: pipeline.steps,
            doc,
            allDocs: docs,
          })
        )
      );
      docs = newDocs.filter((d) => d !== undefined);
      finalResult = docs;
      // if it's an aggregate step - only run it once
    } else if (
      step.input === 'aggregate-docs' ||
      step.input === 'aggregate-results'
    ) {
      let aggregateResult: Doc = {
        id: self.crypto.randomUUID(),
        name: 'Aggregate result',
        content: '',
        processingResults: [],
      };
      aggregateResult = (await runStep({
        step: step!,
        allSteps: pipeline.steps,
        doc: aggregateResult,
        allDocs: docs,
      })) as Doc;
      docs.push(aggregateResult);
      finalResult = aggregateResult;
    }
    // get next step and continue
    stepId = step.connectsTo.at(0);
    step = pipeline.steps.find((s) => s.id === stepId) as
      | ProcessingStep
      | undefined;
  }

  console.log(docs);
  console.log(finalResult);

  // save result to pipeline
  pipeline.results = finalResult;
  return pipeline;
}
