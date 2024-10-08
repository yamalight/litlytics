import type { UIComponents } from '@/components/types';
import type { Pipeline } from '@/pipeline/Pipeline';
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';

export function BasicOutputRender({
  pipeline,
  components,
}: {
  pipeline: Pipeline;
  setPipeline: (p: Pipeline) => void;
  components: UIComponents;
}) {
  const [copied, setCopied] = useState(false);
  const results = useMemo(() => pipeline.results, [pipeline]);
  const result = useMemo(() => {
    if (!results?.length) {
      return '';
    }

    return results
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
        <components.Button
          plain
          onClick={handleCopy}
          className="!absolute top-1 right-2"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="fill-sky-500" />
          ) : (
            <ClipboardDocumentIcon />
          )}
        </components.Button>
        <components.CustomMarkdown>{result}</components.CustomMarkdown>
      </div>
    </div>
  );
}
