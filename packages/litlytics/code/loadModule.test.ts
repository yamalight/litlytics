import { expect, test } from 'vitest';
import { loadModule } from './loadModule';

const testInputBasic = `export default function test(arg) {
return arg;
}`;

test('should import and execute code', async () => {
  const fn = await loadModule(testInputBasic);
  const result = fn(1);
  expect(result).toEqual(1);
});
