import { Pipeline, type LLMArgs, type LitLytics } from 'litlytics';
import { RunPromptFromMessagesArgs } from 'litlytics/engine/runPrompt';
import { agentSystemPrompt } from './prompts/system';
import { agentTools } from './tools/tools';
import { type Message } from './types';

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
  // generate functions list
  const functionsList = agentTools.map((t) => `- ${t.description}`).join('\n');
  // prepend system message
  const agentMessages: RunPromptFromMessagesArgs['messages'] = [
    {
      role: 'system',
      content: agentSystemPrompt.trim().replace('{{FUNCTIONS}}', functionsList),
    },
    ...inputMessages,
  ];
  console.log(agentMessages);

  // generate tools
  const tools: LLMArgs['tools'] = {};
  for (const tool of agentTools) {
    tools[tool.name] = tool.create({
      litlytics,
      setPipeline,
      agentMessages,
      messages,
      resolve,
      reject,
    });
  }

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
