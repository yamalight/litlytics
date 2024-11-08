import { tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Suggest a list of potential pipelines / actions that can be executed on user documents`;

export const analyzeDocuments: ToolDefinition = {
  name: 'analyzeDocuments',
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
        suggest: z.boolean(),
      }),
      execute: async () => {
        try {
          // run task
          const newPipeline = await litlytics.suggestTasks();
          setPipeline(newPipeline);
          // generate a response
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `Suggested tasks from function execution:
${newPipeline.pipelineTasks?.map((task) => '- ' + task)?.join('\n')}

Generate a text description for user.`,
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
