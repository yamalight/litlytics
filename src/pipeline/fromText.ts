import { runPrompt } from '../engine/runPrompt';
import { ProcessingStep, StepInput } from '../step/Step';
import { generateStep } from '../step/generate';
import systemToJSON from './prompts/stepToJSON.txt';
import { parseLLMJSON } from './util';

export async function pipelineFromText(description: string) {
  console.log('pipe from text');
  console.log(description);

  const steps = description
    .split('---')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  console.log(steps);

  const resultSteps: ProcessingStep[] = [];

  for (const step of steps) {
    const stepRes = await runPrompt({
      system: systemToJSON,
      user: step,
    });
    const stepJSON = parseLLMJSON(stepRes.result!) as ProcessingStep;
    const newStep: ProcessingStep = await generateStep({
      id: stepJSON.id,
      description: stepJSON.description,
      name: stepJSON.name,
      input: stepJSON.input as StepInput,
      type: stepJSON.type,
    });
    console.log({ step, stepJSON, newStep });

    // connect to previous
    resultSteps.at(-1)?.connectsTo.push(newStep.id);
    // push to list
    resultSteps.push(newStep);
  }
  console.log(resultSteps);
  return resultSteps;
}
