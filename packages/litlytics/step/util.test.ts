import { expect, test } from 'vitest';
import { cleanResult } from './util';

test('should clean llm result', async () => {
  const result = cleanResult('\ninput\n', 'llm');
  expect(result).toEqual('input');
});

test('should clean code result', async () => {
  const result = cleanResult('```js\ninput\n```', 'code');
  expect(result).toEqual('input\n');
});
