import { tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Function description: Edit an existing step in the pipeline
  Function arguments: step name, refine request
  Extra instructions: User must specify arguments themselves. If user doesn't specify step - ask them for missing information. If step name loosely matches existing step - use full step name instead.`;

export const editStep: ToolDefinition = {
  name: 'editStep',
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
        stepName: z.string(),
        refineRequest: z.string(),
      }),
      execute: async ({ stepName, refineRequest }) => {
        try {
          // find step by name
          const step = litlytics.pipeline.steps.find((s) => s.name === stepName);
          if (!step) {
            throw new Error(`Step "${stepName}" not found in pipeline!`);
          }

          // refine the step
          const newStep = await litlytics.refineStep({
            refineRequest,
            step,
          });

          // update pipeline with refined step
          const newPipeline = {
            ...litlytics.pipeline,
            steps: litlytics.pipeline.steps.map((s) => {
              if (s.id === step.id) {
                return newStep;
              }
              return s;
            }),
          };

          setPipeline(newPipeline);

          // add a message to the agent messages
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `Step "${stepName}" updated: \`\`\`
${JSON.stringify(newStep, null, 2)}
\`\`\``,
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
