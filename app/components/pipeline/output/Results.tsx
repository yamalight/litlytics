import { Doc } from '@/src/doc/Document';
import { CustomMarkdown } from '~/components/markdown/Markdown';

export function RenderResults({ docs }: { docs?: Doc[] }) {
  if (!docs?.length) {
    return (
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        <>No result</>
      </div>
    );
  }

  return (
    <div className="prose prose-sm dark:prose-invert w-full max-w-full">
      {docs.length > 1 ? (
        <>
          {docs.map((doc) => (
            <CustomMarkdown key={doc.id}>{`## Result for "${
              doc.name
            }":\n\n${doc.processingResults
              .map((r) => r.result)
              .join('\n\n---\n\n')}`}</CustomMarkdown>
          ))}
        </>
      ) : (
        <>
          <CustomMarkdown>
            {docs[0].processingResults.map((r) => r.result).join('\n')}
          </CustomMarkdown>
        </>
      )}
    </div>
  );
}
