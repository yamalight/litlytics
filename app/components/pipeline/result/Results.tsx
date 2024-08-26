import { Doc } from '@/src/doc/Document';
import Markdown from 'react-markdown';

export function RenderResults({ results }: { results: Doc[] | Doc }) {
  if (Array.isArray(results)) {
    return (
      <>
        <div className="prose prose-sm dark:prose-invert w-full max-w-full divide-y divide-solid divide-neutral-500/50">
          {results.map((res) => (
            <div key={res.id} className="mb-4">
              <h1>Doc: {res.name}</h1>
              <Markdown>{res.processingResults.at(-1)?.result}</Markdown>
            </div>
          ))}
        </div>
      </>
    );
  }

  const result = results.processingResults.at(0);

  return (
    <>
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        <Markdown>{result?.result}</Markdown>
      </div>
    </>
  );
}
