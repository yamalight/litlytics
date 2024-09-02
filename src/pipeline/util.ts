export function parseLLMJSON(input: string) {
  const cleaned = input.replace(/^```(.+?)\n/g, '').replace(/```$/g, '');
  const json = JSON.parse(cleaned);
  return json;
}
