import { tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Refine suggested pipeline using user request`;

export const refinePipeline: ToolDefinition = {
  name: 'refinePipeline',
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
        refineRequest: z.string(),
      }),
      execute: async ({ refineRequest }) => {
        try {
          // run task
          const newPipeline = await litlytics.refinePipeline({
            refineRequest: refineRequest,
          });
          setPipeline(newPipeline);
          // generate a response
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `Refined pipeline from function execution:
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
