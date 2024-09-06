import { StepResult } from '@/src/step/Step';
import { CustomMarkdown } from '~/components/markdown/Markdown';

export function RenderResults({ result }: { result: StepResult }) {
  return (
    <>
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        {result.result?.length ? (
          <CustomMarkdown>{result.result}</CustomMarkdown>
        ) : (
          <>No result</>
        )}
      </div>
    </>
  );
}
