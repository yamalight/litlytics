import { ChatCompletionMessageParam, MLCEngine } from '@mlc-ai/web-llm';
import {
  ChatCompletionMessageParam as OAIChatCompletionMessageParam,
  CompletionUsage as OAIUsage,
} from 'openai/resources/index.mjs';

// TODO: ??? use
// https://github.com/xenova/transformers.js
// as fallback for when webgpu is not available

// model
const selectedModel = 'Llama-3.1-8B-Instruct-q4f32_1-MLC'; // ~4.9 GB
// const selectedModel = 'Phi-3-mini-4k-instruct-q4f32_1-MLC'; // ~2.1 GB 'Phi-3.5-mini-instruct-q4f16_1-MLC'; //

// create engine
const engine = new MLCEngine();
engine.setInitProgressCallback((initProgress) => {
  console.log(initProgress);
});
engine.reload(selectedModel);

export const runWithWebLLM = async ({
  messages,
  args,
}: {
  messages: OAIChatCompletionMessageParam[];
  args?: { max_tokens?: number; temperature?: number };
}) => {
  const reply = await engine.chat.completions.create({
    messages: messages as ChatCompletionMessageParam[],
    ...args,
  });
  const answers = reply.choices;
  const usage = reply.usage;
  const result = answers[0].message.content;
  return {
    result,
    usage: usage as OAIUsage,
  };
};
