import { StepResult } from '@/src/step/Step';
import { CustomMarkdown } from '~/components/markdown/Markdown';

export function RenderResults({ result }: { result: StepResult[] }) {
  if (!result?.length) {
    return (
      <div className="prose prose-sm dark:prose-invert w-full max-w-full">
        <>No result</>
      </div>
    );
  }

  return (
    <div className="prose prose-sm dark:prose-invert w-full max-w-full">
      {result.map((r, idx) => (
        <CustomMarkdown key={`${r.stepId}_${idx}`}>{r.result}</CustomMarkdown>
      ))}
    </div>
  );
}
