import { Doc } from '../../doc/Document';
import { ProcessingStep, Step } from '../../step/Step';
import { runPrompt } from '../runPrompt';

export async function runLLMStep({
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
  const system = step.prompt!;

  // get previous step and previous result
  const prevStep = allSteps.find((s) => s.connectsTo.includes(step.id));
  const prevResult = doc?.processingResults.find(
    (s) => s.stepId === prevStep?.id
  )?.result;

  // filter doc out if previous step was code and it returned nothing
  if (
    prevStep?.type === 'code' &&
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

  console.log(input);
  const user = input;
  const res = await runPrompt({ system, user });
  // replace existing result if present
  const existingResult = doc?.processingResults.find(
    (r) => r.stepId === step.id
  );
  if (existingResult) {
    existingResult.result = res.result!;
    existingResult.usage = res.usage;
  } else {
    // or insert new one of not
    doc?.processingResults.push({
      stepId: step.id,
      result: res.result!,
      usage: res.usage,
    });
  }
  console.log(doc);
  return doc;
}
