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
