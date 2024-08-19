import { loadModule } from '../code/loadModule';
import { Pipeline } from '../pipeline/Pipeline';
import { Step } from '../step/Step';
import { runPrompt } from './runPrompt';

export async function testPipeline({
  pipeline,
  step,
  docId,
}: {
  pipeline: Pipeline;
  step: Step;
  docId: string;
}) {
  const doc = pipeline.documents.find((d) => d.id === docId);
  if (!doc && step.input !== 'aggregate') {
    throw new Error('Pipeline test execution error: doc not found!');
  }

  // llm execution
  if (step.type === 'llm') {
    const system = step.prompt!;

    // assemble input
    let input = '';
    switch (step.input) {
      case 'doc':
        input = doc?.content ?? '';
        break;
      case 'result':
        input =
          doc?.processingResults.filter((s) => s.stepId !== step.id).at(-1)
            ?.result ?? '';
        break;
      case 'aggregate':
        input =
          pipeline.documents.map((d) => d.content)?.join('\n------\n') ?? '';
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
    return { doc, result: res.result };
  }

  // code execution
  const code = step.code!.replace(/^```(.+?)\n/g, '').replace(/```$/g, '');
  const mod = await loadModule(code);

  let input: string | string[] = '';
  switch (step.input) {
    case 'doc':
      input = doc?.content ?? '';
      break;
    case 'result':
      input =
        doc?.processingResults.filter((s) => s.stepId !== step.id).at(-1)
          ?.result ?? '';
      break;
    case 'aggregate':
      input = pipeline.documents.map((d) => d.content);
      break;
  }
  console.log(input);
  const res = await mod(input);
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
      result: res.result!,
    });
  }
  console.log(doc);
  return { doc, result: `Function result: ${res}` };
}
