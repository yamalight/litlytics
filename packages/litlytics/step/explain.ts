import type { LitLytics } from '../litlytics';
import { parseThinkingOutputResult } from '../pipeline/util';
import { codeExplainPrompt } from './prompts/code-explain';

export const generateCodeExplain = async ({
  litlytics,
  code,
}: {
  litlytics: LitLytics;
  code: string;
}) => {
  if (!code?.length) {
    throw new Error('Must have code to explain!');
  }

  // generate plan from LLM
  const step = await litlytics.runPrompt({
    system: codeExplainPrompt,
    user: code,
  });
  if (!step.result) {
    throw new Error('Error generating explanation!');
  }

  const result = parseThinkingOutputResult(step.result);
  return result;
};
