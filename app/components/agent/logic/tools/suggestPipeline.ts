import { tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Suggest a new pipeline for processing documents for a given task from user`;

export const suggestPipeline: ToolDefinition = {
  name: 'suggestPipeline',
  description,
  create: ({
    litlytics,
    setPipeline,
    agentMessages,
    messages,
    resolve,
    reject,
  }) =>
    tool({
      description,
      parameters: z.object({
        task: z.string(),
      }),
      execute: async ({ task }) => {
        try {
          litlytics.setPipeline({
            pipelineDescription: task,
          });
          // run task
          const newPipeline = await litlytics.generatePipeline();
          setPipeline(newPipeline);
          // generate a response
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `Suggested pipeline from function execution:
${newPipeline.pipelinePlan}

Ask a user if that look fine.`,
              role: 'system',
            },
          ]);
          const result = await litlytics.runPromptFromMessages({
            messages: agentMessagesWithResult,
          });
          resolve(
            messages.concat({
              id: String(messages.length),
              from: 'assistant',
              text: result.result,
            })
          );
        } catch (err) {
          reject(err as Error);
        }
      },
    }),
};
