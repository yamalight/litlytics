import { Pipeline, tool, type LLMArgs, type LitLytics } from 'litlytics';
import { RunPromptFromMessagesArgs } from 'litlytics/engine/runPrompt';
import { z } from 'zod';

const systemPrompt = `
You are Lit - a friendly assistant and an expert in data science.

Your task is to help user design a text document processing pipeline using low-code platform called LitLytics.
LitLytics allows creating custom text document processing pipelines using custom processing steps.
LitLytics supports text documents and .csv, .doc(x), .pdf, .txt text files.

You have access to following LitLytics functions:
- Suggest a list of possible pipelines that can be applied to user's documents or files
- Suggest a new pipeline for processing documents for given task from user
- Refine suggested pipeline using user request
- Assemble suggested pipeline
- Add a new step to pipeline
- Edit a step in the pipeline
- Test a step in the pipeline
- Execute a pipeline

If you can execute one of the functions listed above - do so and let user know you are on it.
`;

export interface Message {
  id: string;
  from: 'user' | 'assistant';
  text: string;
}

export const askAgent = async ({
  messages,
  litlytics,
  setPipeline,
}: {
  messages: Message[];
  litlytics: LitLytics;
  setPipeline: (p: Pipeline) => void;
}): Promise<Message[]> => {
  // create a promise we will use as result
  const { promise, resolve, reject } = Promise.withResolvers<Message[]>();

  // generate input messages
  const inputMessages: RunPromptFromMessagesArgs['messages'] = messages.map(
    (m) => ({
      content: m.text,
      role: m.from,
    })
  );
  const agentMessages: RunPromptFromMessagesArgs['messages'] = [
    {
      role: 'system',
      content: systemPrompt.trim(),
    },
    ...inputMessages,
  ];
  console.log(agentMessages);

  // generate tools
  const tools: LLMArgs['tools'] = {
    analyzeDocuments: tool({
      description: `Suggest a list of possible pipelines that can be applied to user's documents`,
      parameters: z.object({
        suggest: z.boolean(),
      }),
      execute: async () => {
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
      },
    }),
    suggestPipeline: tool({
      description: `Suggest a new pipeline for processing documents for given task from user`,
      parameters: z.object({
        task: z.string(),
      }),
      execute: async ({ task }) => {
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
      },
    }),
    refinePipeline: tool({
      description: `Refine suggested pipeline using user request`,
      parameters: z.object({
        refineRequest: z.string(),
      }),
      execute: async ({ refineRequest }) => {
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
      },
    }),
    createSuggestedPipeline: tool({
      description: `Assemble suggested pipeline`,
      parameters: z.object({
        assemble: z.boolean(),
      }),
      execute: async () => {
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
      },
    }),
  };

  // execute request
  const result = await litlytics.runPromptFromMessages({
    messages: agentMessages,
    args: {
      tools,
    },
  });

  console.log(result);
  if (result.result.length) {
    resolve(
      messages.concat({
        id: String(messages.length),
        from: 'assistant',
        text: result.result,
      })
    );
  }

  return promise;
};
