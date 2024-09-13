import { CoreMessage } from 'ai';
import type { LitLytics } from '../litlytics';
import { Pipeline } from './Pipeline';
import system from './prompts/pipeline.txt?raw';
import { parseThinkingOutputResult } from './util';

export const refinePipeline = async ({
  litlytics,
  refineRequest,
  pipeline,
}: {
  litlytics: LitLytics;
  refineRequest: string;
  pipeline: Pipeline;
}) => {
  if (!pipeline) {
    throw new Error('Pipeline is required for refinement!');
  }

  const messages: CoreMessage[] = [
    { role: 'system', content: system.trim() },
    { role: 'user', content: pipeline.pipelineDescription!.trim() },
    { role: 'assistant', content: pipeline.pipelinePlan!.trim() },
    { role: 'user', content: refineRequest.trim() },
  ];

  // generate plan from LLM
  const plan = await litlytics.runPromptFromMessages({ messages });
  const result = plan.result
    ? parseThinkingOutputResult(plan.result)
    : plan.result;
  return result;
};
