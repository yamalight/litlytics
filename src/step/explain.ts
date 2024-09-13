import { runPrompt } from '../engine/runPrompt';
import { parseThinkingOutputResult } from '../pipeline/util';
import system from './prompts/code-explain.txt?raw';

export const generateCodeExplain = async ({ code }: { code: string }) => {
  if (!code?.length) {
    throw new Error('Must have code to explain!');
  }

  // generate plan from LLM
  const step = await runPrompt({ system, user: code });
  if (!step.result) {
    throw new Error('Error generating explanation!');
  }

  const result = parseThinkingOutputResult(step.result);
  return result;
};
