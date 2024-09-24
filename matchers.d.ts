import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

/* eslint @typescript-eslint/no-empty-object-type: 0 */
declare module 'bun:test' {
  interface Matchers<T>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers extends TestingLibraryMatchers {}
}
