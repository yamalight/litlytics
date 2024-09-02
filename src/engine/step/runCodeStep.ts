import { loadModule } from '../../code/loadModule';
import { Doc } from '../../doc/Document';
import { ProcessingStep, SourceStep } from '../../step/Step';

export async function runCodeStep({
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
  // code execution
  const code = step.code!.replace(/^```(.+?)\n/g, '').replace(/```$/g, '');
  const mod = await loadModule(code);

  let input: string | string[] = '';
  const prevStep: SourceStep | ProcessingStep | undefined =
    allSteps.find((s) => s.connectsTo.includes(step.id)) ??
    source.connectsTo.includes(step.id)
      ? source
      : undefined;
  if (!prevStep) {
    console.log('No prev step:', step, allSteps, source);
    throw new Error('Previous step not found!');
  }
  switch (step.input) {
    case 'doc':
      input = doc?.content ?? '';
      break;
    case 'result':
      input =
        doc?.processingResults.find((s) => s.stepId === prevStep?.id)?.result ??
        '';
      break;
    case 'aggregate-docs':
      input = allDocs.map((d) => d.content)?.filter((r) => r?.length > 0);
      break;
    case 'aggregate-results':
      input = allDocs
        .map(
          (d) =>
            d?.processingResults.find((s) => s.stepId === prevStep?.id)
              ?.result ?? ''
        )
        ?.filter((r) => r?.length > 0);
      break;
  }
  console.log({ input });
  const res = await mod(input);
  console.log({ res });
  // replace existing result if present
  const existingResult = doc?.processingResults.find(
    (r) => r.stepId === step.id
  );
  if (existingResult) {
    existingResult.result = res;
  } else {
    // or insert new one of not
    doc?.processingResults.push({
      stepId: step.id,
      result: res,
    });
  }
  console.log(doc);
  return doc;
}
