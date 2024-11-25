import { tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Function description: Execute current pipeline with all documents`;

export const runPipeline: ToolDefinition = {
  name: 'runPipeline',
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
        execute: z.boolean(),
      }),
      execute: async () => {
        try {
          // run pipeline
          const newPipeline = await litlytics.runPipeline();
          setPipeline(newPipeline);
          // generate a response
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `Pipeline executed. Results:
${newPipeline.results?.map((r) => '- ' + r.result)?.join('\n')}

Notify user. Be brief.`,
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
