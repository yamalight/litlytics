import type { LitLytics } from '@/src/litlytics';
import { Doc } from '../../doc/Document';
import { BaseStep, ProcessingStep, SourceStep } from '../../step/Step';

export interface RunLLMStepArgs {
  litlytics: LitLytics;
  step: ProcessingStep;
  source: SourceStep;
  allSteps: ProcessingStep[];
  doc: Doc;
  allDocs: Doc[];
}
export async function runLLMStep({
  litlytics,
  step,
  source,
  allSteps,
  doc,
  allDocs,
}: RunLLMStepArgs) {
  const system = step.prompt!;
  console.log({ step, source, allSteps, doc, allDocs });

  // get previous step and previous result
  const prevStep: SourceStep | ProcessingStep | undefined =
    allSteps.find((s) => s.connectsTo.includes(step.id)) ??
    (source.connectsTo.includes(step.id) ? source : undefined);
  if (!prevStep) {
    console.log('No prev step:', step, allSteps, source);
    throw new Error('Previous step not found!');
  }

  const prevResult = doc?.processingResults.find(
    (s) => s.stepId === prevStep?.id
  )?.result;

  // filter doc out if previous step was code and it returned nothing
  if (
    (step.input === 'doc' || step.input === 'result') &&
    (prevStep as BaseStep).type === 'code' &&
    (prevResult === undefined || prevResult.length === 0)
  ) {
    return;
  }

  // assemble input
  let input = '';

  switch (step.input) {
    case 'doc':
      input = doc?.content ?? '';
      break;
    case 'result':
      input = prevResult ?? '';
      break;
    case 'aggregate-docs':
      input =
        allDocs
          .map((d) => d.content)
          ?.filter((r) => r?.length > 0)
          ?.join('\n------\n') ?? '';
      break;
    case 'aggregate-results':
      input =
        allDocs
          .map(
            (d) =>
              d?.processingResults.find((s) => s.stepId === prevStep?.id)
                ?.result ?? ''
          )
          ?.filter((r) => r?.length > 0)
          ?.join('\n------\n') ?? '';
      break;
  }

  if (!input.length) {
    throw new Error('No input for step!');
  }

  const user = input;
  const startTime = performance.now();
  const res = await litlytics.runPrompt({ system, user });
  const endTime = performance.now();
  // replace existing result if present
  const existingResult = doc?.processingResults.find(
    (r) => r.stepId === step.id
  );
  if (existingResult) {
    existingResult.result = res.result!;
    existingResult.usage = res.usage;
    existingResult.timingMs = endTime - startTime;
  } else {
    // or insert new one of not
    doc?.processingResults.push({
      stepId: step.id,
      result: res.result!,
      usage: res.usage,
      timingMs: endTime - startTime,
    });
  }
  console.log(doc);
  return doc;
}
