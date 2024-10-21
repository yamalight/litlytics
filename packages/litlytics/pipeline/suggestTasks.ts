import type { LitLytics } from '../litlytics';
import type { Pipeline } from './Pipeline';
import { docToDescriptionPrompt } from './prompts/docToDescription';
import { suggestTasksPrompt } from './prompts/suggestTasksPrompt';
import { parseThinkingOutputResult } from './util';

export const suggestTasks = async ({
  litlytics,
  pipeline,
}: {
  litlytics: LitLytics;
  pipeline: Pipeline;
}) => {
  const testDocs = structuredClone(pipeline.source.docs.filter((d) => d.test));
  if (!testDocs?.length) {
    throw new Error('At least one test document is required!');
  }

  // generate test doc summaries
  for (const doc of testDocs) {
    // if doc already has summary - skip generation
    if (doc.summary?.length) {
      continue;
    }
    // generate summary for current doc
    const genSummary = await litlytics.runPrompt({
      system: docToDescriptionPrompt,
      user: doc.content,
    });
    const resultSummary = genSummary.result
      ? parseThinkingOutputResult(genSummary.result)
      : genSummary.result;
    // assign to doc
    doc.summary = resultSummary;
  }

  // use new docs summaries to generate possible tasks
  const genTasks = await litlytics.runPrompt({
    system: suggestTasksPrompt,
    user: testDocs.map((d) => `${d.summary}`).join('\n------\n'),
  });
  const resultTasksString = genTasks.result
    ? parseThinkingOutputResult(genTasks.result)
    : genTasks.result;
  const resultTasks = resultTasksString
    .split('\n')
    .map((task) => task.replace(/^-/, '').trim());

  // return pipeline
  return {
    docs: testDocs,
    tasks: resultTasks,
  };
};
