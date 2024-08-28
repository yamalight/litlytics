import { runPrompt } from '../engine/runPrompt';
import { SourceStep, Step, StepInput } from '../step/Step';
import { generateStep } from '../step/generate';
import systemToJSON from './prompts/stepToJSON.txt';
import { parseLLMJSON } from './util';

export async function pipelineFromText(description: string) {
  console.log('pipe from text');
  console.log(description);

  const steps = description.split('---').map((s) => s.trim());
  console.log(steps);

  const resultSteps: Step[] = [];

  for (const step of steps) {
    const stepRes = await runPrompt({
      system: systemToJSON,
      user: step,
    });
    const stepJSON = parseLLMJSON(stepRes.result!) as Step;
    let newStep: Step | undefined = undefined;
    if (stepJSON.type !== 'source') {
      newStep = await generateStep({
        id: stepJSON.id,
        description: stepJSON.description,
        name: stepJSON.name,
        input: stepJSON.input as StepInput,
        type: stepJSON.type,
      });
    } else {
      newStep = stepJSON as SourceStep;
    }
    console.log({ step, stepJSON, newStep });

    // adjust new step position
    newStep.position.y += 80 * resultSteps.length;
    // connect to previous
    resultSteps.at(-1)?.connectsTo.push(newStep.id);
    // push to list
    resultSteps.push(newStep);
  }
  console.log(resultSteps);
  return resultSteps;
}
