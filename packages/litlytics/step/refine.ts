import type { CoreMessage } from 'ai';
import type { LitLytics } from '../litlytics';
import { parseThinkingOutputResult } from '../pipeline/util';
import { codeStepPrompt } from './prompts/code-step';
import { llmStepPrompt } from './prompts/llm-step';
import type { ProcessingStep } from './Step';
import { cleanResult } from './util';

export const refineStep = async ({
  litlytics,
  refineRequest,
  step,
}: {
  litlytics: LitLytics;
  refineRequest: string;
  step: ProcessingStep;
}) => {
  if (!step) {
    throw new Error('Step is required for refinement!');
  }

  // create user prompt
  const user = `Step name: ${step.name}
Step description: ${step.description}
Step input: ${step.input}`;

  // determine system prompt based on step type
  const system = step.type === 'llm' ? llmStepPrompt : codeStepPrompt;

  // determine result
  const result = step.type === 'llm' ? step.prompt : step.code;

  // construct refine message chain
  const messages: CoreMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
    { role: 'assistant', content: result! },
    { role: 'user', content: refineRequest.trim() },
  ];

  // generate plan from LLM
  const plan = await litlytics.runPromptFromMessages({ messages });
  const res = plan.result
    ? parseThinkingOutputResult(plan.result)
    : plan.result;
  if (!res) {
    throw new Error('Error refining step!');
  }

  const newStep = structuredClone(step);
  if (step.type === 'llm') {
    newStep.prompt = res;
  } else {
    const cleanedCode = cleanResult(res, step.type);
    newStep.code = cleanedCode;
    newStep.codeExplanation = await litlytics.generateCodeExplain({
      code: cleanedCode,
    });
  }
  return newStep;
};
