import { Doc } from '@/src/doc/Document';
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { CustomMarkdown } from '~/components/markdown/Markdown';

export function RenderResults({ docs }: { docs?: Doc[] }) {
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => {
    if (!docs?.length) {
      return '';
    }

    if (docs.length > 1) {
      return docs
        .filter((doc) => doc?.processingResults?.length > 0)
        .map(
          (doc) =>
            `## Result for "${doc.name}":\n\n${doc.processingResults
              .map((r) => r.result)
              .join('\n\n---\n\n')}`
        )
        .join('\n\n');
    }

    return docs[0].processingResults.map((r) => r.result).join('\n');
  }, [docs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!docs?.length) {
    return (
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        <>No result</>
      </div>
    );
  }

  return (
    <div className="prose prose-sm dark:prose-invert w-full max-w-full">
      <Button plain onClick={handleCopy} className="!absolute top-1 right-2">
        {copied ? (
          <ClipboardDocumentCheckIcon className="fill-sky-500" />
        ) : (
          <ClipboardDocumentIcon />
        )}
      </Button>
      <CustomMarkdown>{result}</CustomMarkdown>
    </div>
  );
}
