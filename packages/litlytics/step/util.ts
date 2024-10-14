import type { ProcessingStepTypes } from './Step';

export function cleanResult(input: string | null, type: ProcessingStepTypes) {
  if (!input) {
    return '';
  }

  if (type === 'llm') {
    return input.trim();
  }

  const cleaned = input.replace(/^```(.+?)\n/g, '').replace(/```$/g, '');
  return cleaned;
}
