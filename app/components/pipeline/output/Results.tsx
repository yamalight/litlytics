import { Doc } from '@/src/doc/Document';
import { CustomMarkdown } from '../../markdown/Markdown';

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
                    <CustomMarkdown>{r?.result}</CustomMarkdown>
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
          <CustomMarkdown key={r.stepId}>{r?.result}</CustomMarkdown>
        ))}
      </div>
    </>
  );
}
