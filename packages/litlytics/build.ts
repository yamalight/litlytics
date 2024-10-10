await Bun.build({
  entrypoints: ['./litlytics.ts'],
  outdir: './dist',
  packages: 'external',
  target: 'node',
});
