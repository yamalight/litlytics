import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { runPromptFromMessages } from '../engine/runPrompt';
import { Pipeline } from './Pipeline';
import system from './prompts/pipeline.txt';

export const refinePipeline = async ({
  refineRequest,
  pipeline,
}: {
  refineRequest: string;
  pipeline: Pipeline;
}) => {
  if (!pipeline) {
    throw new Error('Pipeline is required for refinement!');
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: system.trim() },
    { role: 'user', content: pipeline.pipelineDescription!.trim() },
    { role: 'assistant', content: pipeline.pipelinePlan!.trim() },
    { role: 'user', content: refineRequest.trim() },
  ];

  // generate plan from LLM
  const plan = await runPromptFromMessages({ messages });
  return plan.result;
};