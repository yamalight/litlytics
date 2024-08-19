import { ChatCompletionMessageParam, MLCEngine } from '@mlc-ai/web-llm';
import {
  ChatCompletionMessageParam as OAIChatCompletionMessageParam,
  CompletionUsage as OAIUsage,
} from 'openai/resources/index.mjs';

// model
const selectedModel = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';

// create engine
const engine = new MLCEngine();
engine.setInitProgressCallback((initProgress) => {
  console.log(initProgress);
});
engine.reload(selectedModel);

export const runWithWebLLM = async ({
  messages,
}: {
  messages: OAIChatCompletionMessageParam[];
}) => {
  const reply = await engine.chat.completions.create({
    messages: messages as ChatCompletionMessageParam[],
  });
  const answers = reply.choices;
  const usage = reply.usage;
  const result = answers[0].message.content;
  return {
    result,
    usage: usage as OAIUsage,
  };
};
