import { expect, test } from 'vitest';
import { LitLytics } from '../litlytics';
import { allDocs, doc, docSecond, pipeline } from '../test/testPipeline';
import { getResults } from './getResults';
import { OUTPUT_ID } from './Output';

test('Should convert docs to results', async () => {
  const litlytics = new LitLytics({
    provider: 'openai',
    model: 'test',
    key: 'test',
  });
  litlytics.pipeline = pipeline;
  const newDocs = allDocs.map((d) => {
    const step = pipeline.steps.find((s) =>
      s.connectsTo.includes(OUTPUT_ID)
    )?.id;
    d.processingResults = [
      {
        stepId: step!,
        timingMs: 0,
        result: `${d.id} result`,
      },
    ];
    return d;
  });
  const results = getResults(litlytics, newDocs);
  expect(results).toHaveLength(2);
  expect(results[0].doc.id).toEqual(doc.id);
  expect(results[0].result).toEqual(`${doc.id} result`);
  expect(results[1].doc.id).toEqual(docSecond.id);
  expect(results[1].result).toEqual(`${docSecond.id} result`);
});
