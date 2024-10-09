import type { LanguageModelUsage } from 'ai';
import { expect, test } from 'vitest';
import { LitLytics, type ProcessingStep } from '../litlytics';
import type { GenerateStepArgs } from '../step/generate';
import { pipelineFromText } from './fromText';

const testPlan = `Step name: Generate Title and Description
Step type: llm
Step input: doc
Step description: Generate an Etsy product title and description based on the provided document describing the product.

---

Step name: Check for Copyrighted Terms
Step type: llm
Step input: result
Step description: Analyze the generated title and description for possible copyrighted terms and suggest edits.
`;

const firstStepJson = `{"id": 1, "name": "Generate Title and Description", "description": "Step 1", "type": "llm", "input": "doc"}`;
const secondStepJson = `{"id": 2, "name": "Check for Copyrighted Terms", "description": "Step 2", "type": "llm", "input": "doc"}`;

const stepOne: ProcessingStep = {
  id: 'step_1',
  name: 'Step 1',
  description: 'Step 1',
  type: 'llm',
  connectsTo: [],
  prompt: 'test',
};
const stepTwo: ProcessingStep = {
  id: 'step_2',
  name: 'Step 2',
  description: 'Step 2',
  type: 'code',
  connectsTo: [],
  code: 'test',
};

test('Should generate pipeline steps from text', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  // mock step-to-json prompt
  litlytics.runPrompt = async ({ user }: { system: string; user: string }) => {
    if (user.includes('Title')) {
      return { result: firstStepJson, usage: {} as LanguageModelUsage };
    }
    return { result: secondStepJson, usage: {} as LanguageModelUsage };
  };
  // mock step generation
  litlytics.generateStep = async ({
    id,
  }: Omit<GenerateStepArgs, 'litlytics'>) => {
    if (id === 'step_1') {
      return stepOne;
    }
    return stepTwo;
  };
  const steps: number[] = [];
  let totalStepsVal = -1;
  const result = await pipelineFromText(
    litlytics,
    testPlan,
    ({ step, totalSteps }) => {
      steps.push(step);
      totalStepsVal = totalSteps;
    }
  );
  expect(steps).toEqual([1, 2]);
  expect(totalStepsVal).toEqual(2);
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual({
    ...stepOne,
    connectsTo: [stepTwo.id],
  });
  expect(result[1]).toEqual(stepTwo);
});
