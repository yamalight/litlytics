import type { LitLytics } from '../litlytics';
import { parseThinkingOutputResult } from '../pipeline/util';
import { ProcessingStep, ProcessingStepTypes, StepInput } from './Step';
import codeSystem from './prompts/code-step.txt?raw';
import llmSystem from './prompts/llm-step.txt?raw';
import { cleanResult } from './util';

export interface GenerateStepArgs {
  litlytics: LitLytics;
  id: string;
  name: string;
  description: string;
  input: StepInput;
  type: ProcessingStepTypes;
}
export const generateStep = async ({
  litlytics,
  id,
  name,
  description,
  input,
  type,
}: GenerateStepArgs) => {
  if (!name?.length || !description?.length) {
    throw new Error('Step must have a name and a description!');
  }

  // create user prompt
  const user = `Step name: ${name}
Step description: ${description}
Step input: ${input}`;

  // determine system prompt based on step type
  const system = type === 'llm' ? llmSystem : codeSystem;

  // generate plan from LLM
  const step = await litlytics.runPrompt({ system, user });

  const cleanedResult = cleanResult(step.result, type);
  const result = parseThinkingOutputResult(cleanedResult);

  let explanation: string | undefined = undefined;
  if (type === 'code') {
    explanation = await litlytics.generateCodeExplain({ code: result });
  }

  const newStep: ProcessingStep = {
    id,
    name,
    description,
    type,
    input,
    code: type === 'code' ? result : undefined,
    codeExplanation: type === 'code' ? explanation : undefined,
    prompt: type === 'llm' ? result : undefined,
    connectsTo: [],
    expanded: true,
  };
  console.log(newStep);

  return newStep;
};
