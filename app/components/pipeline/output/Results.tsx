import { StepResult } from '@/src/step/Step';
import { CustomMarkdown } from '../../markdown/Markdown';

export function RenderResults({ result }: { result: StepResult }) {
  return (
    <>
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        <CustomMarkdown>{result.result}</CustomMarkdown>
      </div>
    </>
  );
}
