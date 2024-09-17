import { expect, test } from 'bun:test';
import { parseLLMJSON } from './util';

const testInputBasic = `\`\`\`
{
  "id": "test",
  "name": "Test",
  "description": "Test desc",
  "type": "llm",
  "connectsTo": [],
  "input": "doc"
}
\`\`\``;

test('should clean and parse basic json', () => {
  const result = parseLLMJSON(testInputBasic);
  expect(result.id).toEqual('test');
  expect(result.name).toEqual('Test');
});

const testInputAround = `
Here is the JSON representation of the step:

\`\`\`
{
  "id": "test",
  "name": "Test",
  "description": "Test desc",
  "type": "llm",
  "connectsTo": [],
  "input": "doc"
}
\`\`\`

Hope this helps!
`;

test('should clean and parse json with extra text around', () => {
  const result = parseLLMJSON(testInputAround);
  expect(result.id).toEqual('test');
  expect(result.name).toEqual('Test');
});

const testInputAroundTwo =
  'Here is the JSON representation of the step:\n\n```json\n{\n  "id": "test",\n  "name": "Test",\n  "description": "Test desc",\n  "type": "llm",\n  "connectsTo": [],\n  "input": "result"\n}\n```\n\nNote: I\'ve left the `id` field empty, as it\'s likely to be generated automatically or provided separately. If you have a specific `id` in mind, feel free to replace it.';

test('should clean and parse json with extra text around #2', () => {
  const result = parseLLMJSON(testInputAroundTwo);
  expect(result.id).toEqual('test');
  expect(result.name).toEqual('Test');
});
