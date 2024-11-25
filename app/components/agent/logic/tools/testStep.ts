import { tool } from 'litlytics';
import { z } from 'zod';
import { ToolDefinition } from '../types';

const description = `Function description: Test a specific pipeline step with a given test document
  Function arguments: step name, test document name
  Extra instructions: User must specify arguments themselves. If user doesn't specify step or document - ask them for missing information. If step name or document name loosely matches existing step or document - use full step name or document name instead.`;

export const testStep: ToolDefinition = {
  name: 'testStep',
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
        documentName: z.string(),
      }),
      execute: async ({ stepName, documentName }) => {
        try {
          // find step by name
          const step = litlytics.pipeline.steps.find((s) => s.name === stepName);
          if (!step) {
            throw new Error(`Step "${stepName}" not found in pipeline!`);
          }

          // find test document by name
          const doc = litlytics.pipeline.source.docs.find(
            (d) => d.name === documentName && d.test
          );
          if (!doc) {
            throw new Error(
              `Test document "${documentName}" not found in pipeline source!`
            );
          }

          // run test
          const testDoc = await litlytics.testPipelineStep({
            step,
            docId: doc.id,
          });

          // update pipeline with test results
          const newDocs = litlytics.pipeline.source.docs.map((d) => {
            if (d.id === testDoc?.id) {
              return testDoc;
            }
            return d;
          });
          const newPipeline = litlytics.setDocs(newDocs);
          setPipeline(newPipeline);

          // find test result
          const testResult = testDoc?.processingResults.find(
            (r) => r.stepId === step.id
          );

          // add a message to the agent messages
          const agentMessagesWithResult = agentMessages.concat([
            {
              content: `Test result for step "${stepName}" with document "${documentName}":
${testResult?.result ?? 'No result'}`,
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
