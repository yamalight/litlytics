import { runPrompt } from '../engine/runPrompt';
import { Step, StepInput, StepType } from './Step';
import codeSystem from './prompts/code-step.txt';
import llmSystem from './prompts/llm-step.txt';

export const generateStep = async ({
  id,
  name,
  description,
  input,
  type,
}: {
  id: string;
  name: string;
  description: string;
  input: StepInput;
  type: StepType;
}) => {
  if (!name?.length || !description?.length) {
    throw new Error('Step must have a name and a description!');
  }

  // create user prompt
  const user = `Step name: ${name}
Step description: ${description}`;

  // determine system prompt based on step type
  const system = type === 'llm' ? llmSystem : codeSystem;

  // generate plan from LLM
  const step = await runPrompt({ system, user });

  const newStep: Step = {
    id,
    name,
    description,
    type,
    input,
    code: type === 'code' ? step.result ?? '' : '',
    prompt: type === 'llm' ? step.result ?? '' : '',
    position: { x: 0, y: 0 },
    connectsTo: [],
  };
  console.log(newStep);

  return newStep;
};
