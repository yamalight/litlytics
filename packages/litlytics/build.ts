// ignore ban ts comment and ignore top level await
/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-ignore
await Bun.build({
  entrypoints: ['./litlytics.ts'],
  outdir: './dist',
  packages: 'external',
  target: 'node',
});
