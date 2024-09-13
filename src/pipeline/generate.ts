import type { LitLytics } from '../litlytics';
import system from './prompts/pipeline.txt?raw';
import { parseThinkingOutputResult } from './util';

export const generatePipeline = async ({
  litlytics,
  description,
}: {
  litlytics: LitLytics;
  description: string;
}) => {
  if (!description?.length) {
    throw new Error('Pipeline description is required!');
  }

  // generate plan from LLM
  const plan = await litlytics.runPrompt({ system, user: description });
  const plannedSteps = plan.result
    ? parseThinkingOutputResult(plan.result)
    : plan.result;

  const steps = plannedSteps
    ?.split('---')
    .map((s) => s.trim())
    .join('\n\n---\n\n');
  return steps;
};
