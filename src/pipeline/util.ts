export function parseLLMJSON(input: string) {
  // replace comments before and after backticks if present (usually done by smaller models)
  const cleaned = input
    .replace(/^[\s\S]*?```(.+?)\n|```[\s\S]*$/gs, '$1')
    .trim();
  const json = JSON.parse(cleaned);
  return json;
}

export function parseThinkingOutputResult(input: string) {
  // if there's no thinking and output tags in input - just return as-is
  if (!input.includes('<thinking') && !input.includes('<output')) {
    return input;
  }

  const [_chainOfThought, outputStart] = input.split('<output>');
  const [output] = outputStart.trim().split('</output>');
  return output.trim();
}
