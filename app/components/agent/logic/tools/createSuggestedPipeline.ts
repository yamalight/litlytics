import { tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Assemble suggested pipeline`;

export const createSuggestedPipeline: ToolDefinition = {
  name: 'createSuggestedPipeline',
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
        assemble: z.boolean(),
      }),
      execute: async () => {
        try {
          // run task
          // generate plan from LLM
          const newPipeline = await litlytics.pipelineFromText(
            ({ step, totalSteps }) => {
              if (step > totalSteps) {
                // setProgress('');
                return;
              }

              // setProgress(`Generating steps: ${step} / ${totalSteps}`);
            }
          );
          setPipeline(newPipeline);
          // generate a response
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `Pipeline assembled. Notify user. Be brief.`,
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
