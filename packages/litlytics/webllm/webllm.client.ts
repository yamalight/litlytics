import type { ChatCompletionMessageParam, MLCEngine } from '@mlc-ai/web-llm';
import type { CoreMessage, LanguageModelUsage } from 'ai';

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
  console.log(answers.map((a) => a.message.content));
  const result = answers[0].message.content;
  return {
    result,
    usage,
  };
};
