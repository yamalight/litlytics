import type { CoreMessage } from 'ai';
import type { LitLytics } from '../litlytics';
import type { Pipeline } from './Pipeline';
import { pipelinePrompt } from './prompts/pipeline';
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
    { role: 'system', content: pipelinePrompt.trim() },
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
