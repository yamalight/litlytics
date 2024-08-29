import { Doc } from '@/src/doc/Document';
import React from 'react';
import Markdown from 'react-markdown';

export function RenderResults({ results }: { results: Doc[] | Doc }) {
  if (Array.isArray(results)) {
    return (
      <>
        <div className="prose prose-sm dark:prose-invert w-full max-w-full">
          {results.map((res) => (
            <div key={res.id} className="mb-4">
              <h1>Doc: {res.name}</h1>
              <div className="divide-y divide-neutral-600/50">
                {res.processingResults.map((r) => (
                  <div key={r.stepId}>
                    <Markdown>{r?.result}</Markdown>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  const result = results.processingResults;

  return (
    <>
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        {result.map((r) => (
          <Markdown key={r.stepId}>{r?.result}</Markdown>
        ))}
      </div>
    </>
  );
}
