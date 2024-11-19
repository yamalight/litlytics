import { SourceStep } from '@/packages/litlytics/litlytics';
import { ProcessingStep, tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Function description: Add a new step to the pipeline
  Function arguments: step type, name, description, input type and a step to connect to
  Extra instructions: User must specify arguments themselves. Consider primary source to be a possible source step as well.`;

export const addNewStep: ToolDefinition = {
  name: 'addNewStep',
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
        stepType: z.enum(['llm', 'code']),
        stepName: z.string(),
        stepDescription: z.string(),
        stepInput: z.enum(['doc', 'result', 'aggregate-docs', 'aggregate-results']),
        sourceStepId: z.string().optional(),
      }),
      execute: async ({ stepType, stepName, stepDescription, stepInput, sourceStepId }) => {
        try {
          const newStep = {
            id: crypto.randomUUID(), // Generate a unique ID for the step using UUID
            name: stepName,
            description: stepDescription,
            type: stepType,
            connectsTo: [],
            input: stepInput,
          };

          // find source step by ID
          let sourceStep: SourceStep | ProcessingStep | undefined = litlytics.pipeline.steps.find((s) => s.id === sourceStepId);
          if (sourceStepId === litlytics.pipeline.source.id) {
            sourceStep = litlytics.pipeline.source;
          }

          // add the new step to the pipeline
          const newPipeline = await litlytics.addStep({
            step: newStep,
            sourceStep,
          });

          setPipeline(newPipeline);

          // find newly added step
          const createdStep = newPipeline.steps.find((s) => s.name === newStep.name);

          // add a message to the agent messages
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `New step added: \`\`\`
${JSON.stringify(createdStep, null, 2)}
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

