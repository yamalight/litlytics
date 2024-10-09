import type { Doc } from '../doc/Document';
import type { LitLytics } from '../litlytics';
import { OUTPUT_ID, type Result } from './Output';

export function getResults(litlytics: LitLytics, newDocs: Doc[]) {
  if (!newDocs) {
    throw new Error('No docs to extract results from!');
  }

  // get all docs that have been processed by last step
  const res = newDocs
    .filter((doc) => doc)
    .map((doc) => {
      const d = structuredClone(doc);
      d.processingResults = d.processingResults.filter((r) => {
        const steps = litlytics.pipeline.steps.filter(
          (s) => s.id === r.stepId && s.connectsTo.includes(OUTPUT_ID)
        );
        return steps.length > 0;
      });
      return d;
    });

  // if there are no results - throw an error
  if (!res?.length) {
    throw new Error('No output results!');
  }

  // map processing results to self-contained doc results
  const final: Result[] = res
    .map((doc) =>
      doc.processingResults.map(
        (p) =>
          ({
            ...p,
            doc,
          } as Result)
      )
    )
    .flat();
  // store
  litlytics.pipeline.results = final;
  return final;
}
