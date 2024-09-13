import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { runPromptFromMessages } from '../engine/runPrompt';
import { parseThinkingOutputResult } from '../pipeline/util';
import { generateCodeExplain } from './explain';
import codeSystem from './prompts/code-step.txt?raw';
import llmSystem from './prompts/llm-step.txt?raw';
import { ProcessingStep } from './Step';

export const refineStep = async ({
  refineRequest,
  step,
}: {
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
  const system = step.type === 'llm' ? llmSystem : codeSystem;

  // determine result
  const result = step.type === 'llm' ? step.prompt : step.code;

  // construct refine message chain
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
    { role: 'assistant', content: result },
    { role: 'user', content: refineRequest.trim() },
  ];

  // generate plan from LLM
  const plan = await runPromptFromMessages({ messages });
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
    newStep.code = res;
    newStep.codeExplanation = await generateCodeExplain({ code: res });
  }
  return newStep;
};
