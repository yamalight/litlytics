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
  return plan.result;
};
