import { expect, test } from 'bun:test';
import { parseLLMJSON, parseThinkingOutputResult } from './util';

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

const thinkingInputWithExtras =
  "<thinking>\n\nTo create a system prompt that identifies non-vegan ingredients in the original recipes, I'll consider the following steps:\n\n1. **Text Preprocessing**: Remove any unnecessary text and format the document for analysis.\n2. **Ingredient Extraction**: Identify and extract all ingredients mentioned in the document.\n3. **Vegan Filtering**: Filter out vegan-friendly ingredients and identify non-vegan ingredients.\n4. **Ingredient Categorization**: Categorize non-vegan ingredients for further analysis.\n\nTo implement these steps, I'll use a chain-of-thought prompting technique, which involves providing a series of sub-goals to the LLM, each building upon the previous one.\n\nHere's the system prompt:\n\n<output>\n\n\"Identify Non-Vegan Ingredients:\n\n1. Preprocess the text to remove unnecessary information and format the document for analysis.\n2. Extract all ingredients mentioned in the document.\n3. Filter out vegan-friendly ingredients (e.g., fruits, vegetables, whole grains) and identify non-vegan ingredients (e.g., animal-derived products, by-products).\n4. Categorize non-vegan ingredients into groups (e.g., dairy, eggs, meat).\n\nPlease process the document 'doc' using these steps and provide the list of non-vegan ingredients found in the original recipe.\"\n\n</output>";

test('should clean and parse thinking output with extra symbols', () => {
  const result = parseThinkingOutputResult(thinkingInputWithExtras);
  expect(result.at(0)).not.toEqual('"');
  expect(result.at(-1)).not.toEqual('"');
});
