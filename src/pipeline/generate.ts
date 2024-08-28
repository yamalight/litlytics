import { runPrompt } from '../engine/runPrompt';
import system from './prompts/pipeline.txt';

export const generatePipeline = async ({
  description,
}: {
  description: string;
}) => {
  if (!description?.length) {
    throw new Error('Pipeline description is required!');
  }

  // generate plan from LLM
  const plan = await runPrompt({ system, user: description });
  const plannedSteps = plan.result;

  const steps = plannedSteps
    ?.split('---')
    .map((s) => s.trim())
    .join('\n\n---\n\n');
  return steps;
};
