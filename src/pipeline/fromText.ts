import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { runPromptFromMessages } from '../engine/runPrompt';
import { executeOnLLMWithJSON } from '../llm/llm';
import { BaseStepZod } from '../step/Step';
import system from './prompts/pipeToCode.txt';

const PipelineSchema = z.object({
  steps: z.array(BaseStepZod),
});

export async function pipelineFromText(description: string) {
  const completion = await runPromptFromMessages({
    messages: [
      {
        role: 'system',
        content: system,
      },
      { role: 'user', content: description },
    ],
    response_format: zodResponseFormat(PipelineSchema, 'pipeline'),
  });
  console.log(completion);
  return completion as unknown as ReturnType<typeof executeOnLLMWithJSON>;
}
