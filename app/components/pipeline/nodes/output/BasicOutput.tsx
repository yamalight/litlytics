import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/solid';
import { Pipeline } from 'litlytics';
import { useMemo, useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { CustomMarkdown } from '~/components/markdown/Markdown';

export function BasicOutputRender({ pipeline }: { pipeline: Pipeline }) {
  const [copied, setCopied] = useState(false);
  const results = useMemo(() => pipeline.results, [pipeline]);
  const result = useMemo(() => {
    if (!results?.length) {
      return '';
    }

    return results
      .filter((res) => res.result)
      .map((res) => `## Result for "${res.doc.name}":\n\n${res.result}`)
      .join('\n\n')
      .trim();
  }, [results]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!results?.length) {
    return (
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        <>No result</>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
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
    </div>
  );
}
