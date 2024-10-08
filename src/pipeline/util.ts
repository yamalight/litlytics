export function parseLLMJSON(input: string) {
  // replace comments before and after backticks if present (usually done by smaller models)
  const cleaned = input.replace(/^[\s\S]*?```(.*?)\n|```[\s\S]*$/gs, '').trim();
  const json = JSON.parse(cleaned);
  return json;
}

export function parseThinkingOutputResult(input?: string | null) {
  if (!input) {
    throw new Error('No input passed for parsing!');
  }
  // if there's no thinking and output tags in input - just return as-is
  if (!input.includes('<thinking') && !input.includes('<output')) {
    return input;
  }
  // if there's no output tags in input - just remove thinking bits
  if (!input.includes('<output')) {
    const [_chainOfThought, output] = input.split('</thinking>');
    const out = output.trim();
    const cleaned = out.replace(/^"|"$/gs, '').trim();
    return cleaned;
  }

  const [_chainOfThought, outputStart] = input.split('<output>');
  const [output] = outputStart.trim().split('</output>');
  const out = output.trim();
  const cleaned = out.replace(/^"|"$/gs, '').trim();
  return cleaned;
}
