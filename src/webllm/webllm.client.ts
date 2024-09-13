import { ChatCompletionMessageParam, MLCEngine } from '@mlc-ai/web-llm';
import { CoreMessage, LanguageModelUsage } from 'ai';

// TODO: ??? use
// https://github.com/xenova/transformers.js
// as fallback for when webgpu is not available

export const runWithWebLLM = async ({
  engine,
  messages,
  args,
}: {
  engine?: MLCEngine;
  messages: CoreMessage[];
  args?: { max_tokens?: number; temperature?: number };
}) => {
  if (!engine) {
    throw new Error('WebLLM engine required! Load model first!');
  }
  console.log(messages);
  const reply = await engine.chat.completions.create({
    messages: messages as ChatCompletionMessageParam[],
    ...args,
  });
  const answers = reply.choices;
  const usage: LanguageModelUsage = {
    completionTokens: reply.usage?.completion_tokens ?? 0,
    promptTokens: reply.usage?.prompt_tokens ?? 0,
    totalTokens: reply.usage?.total_tokens ?? 0,
  };
  console.log(answers);
  const result = answers[0].message.content;
  return {
    result,
    usage,
  };
};
