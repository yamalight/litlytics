import type { LitLytics } from '@/litlytics';
import type { ProcessingStep, StepInput } from '@/step/Step';
import systemToJSON from './prompts/stepToJSON.txt';
import { parseLLMJSON } from './util';

export async function pipelineFromText(
  litlytics: LitLytics,
  description: string,
  onStatus: ({ step, totalSteps }: { step: number; totalSteps: number }) => void
) {
  let steps = description
    .split('---')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // if split failed - try to re-split by name prefix (usually happens on smaller models)
  if (steps.length === 1) {
    steps = description
      .split('Step name')
      .filter((s) => s.length > 0)
      .map((s) => `Step name: ${s}`.trim());
  }

  const resultSteps: ProcessingStep[] = [];

  let currentStep = 1;
  for (const step of steps) {
    onStatus({ step: currentStep, totalSteps: steps.length });
    const stepRes = await litlytics.runPrompt({
      system: systemToJSON,
      user: step,
    });
    const stepJSON = parseLLMJSON(stepRes.result!) as ProcessingStep;
    // generate id manually if LLM didn't do it for us (mostly happens with smaller LLMs)
    const id = stepJSON.id.length > 0 ? stepJSON.id : `step_${currentStep}`;
    // generate step
    const newStep: ProcessingStep = await litlytics.generateStep({
      id,
      description: stepJSON.description,
      name: stepJSON.name,
      input: stepJSON.input as StepInput,
      type: stepJSON.type,
    });

    // connect to previous
    resultSteps.at(-1)?.connectsTo.push(newStep.id);
    // push to list
    resultSteps.push(newStep);
    currentStep++;
  }
  return resultSteps;
}
