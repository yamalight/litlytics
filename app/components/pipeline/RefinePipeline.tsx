import { useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { Textarea } from '~/components/catalyst/textarea';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';
import { useLitlytics } from '~/store/store';

export function RefinePipeline({ hide }: { hide: () => void }) {
  const litlytics = useLitlytics();
  const [error, setError] = useState<Error>();
  const [refine, setRefine] = useState(``);
  const [progress, setProgress] = useState('');

  const doRefine = async () => {
    if (!refine?.length) {
      return;
    }

    try {
      // generate plan from LLM
      await litlytics.refinePipeline({
        refineRequest: refine,
      });
      setRefine('');
    } catch (err) {
      setError(err as Error);
      litlytics.setPipelineStatus({ status: 'error' });
    }
  };

  const doCreate = async () => {
    try {
      // generate plan from LLM
      await litlytics.pipelineFromText(({ step, totalSteps }) => {
        if (step > totalSteps) {
          setProgress('');
          return;
        }

        setProgress(`Generating steps: ${step} / ${totalSteps}`);
      });
      hide();
    } catch (err) {
      setError(err as Error);
      litlytics.setPipelineStatus({ status: 'error' });
    }
  };

  const inProgress =
    litlytics.pipelineStatus.status === 'refine' ||
    litlytics.pipelineStatus.status === 'sourcing' ||
    litlytics.pipelineStatus.status === 'step';

  return (
    <div className="w-full h-full p-4 prose prose-sm prose-no-nr dark:prose-invert ">
      <div className="flex w-full items-center justify-between">
        <h1 className="m-0">Suggested pipeline:</h1>
      </div>

      <CustomMarkdown>{litlytics.pipeline.pipelinePlan}</CustomMarkdown>
      <div className="flex gap-1">
        <Textarea
          rows={2}
          placeholder="Your request..."
          disabled={inProgress}
          value={refine}
          onChange={(e) => setRefine(e.target.value)}
        />
        <Button onClick={doRefine} disabled={inProgress}>
          {litlytics.pipelineStatus.status === 'refine' && (
            <Spinner className="h-5 w-5" />
          )}
          Refine
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-red-400 dark:bg-red-700 rounded-xl py-1 px-2 mt-3">
          Error generating: {error.message}
        </div>
      )}

      <div className="flex mt-8">
        <Button onClick={doCreate} disabled={inProgress}>
          {(litlytics.pipelineStatus.status === 'sourcing' ||
            litlytics.pipelineStatus.status === 'step') && (
            <div className="flex items-center">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          {litlytics.pipelineStatus.status === 'sourcing' ||
          litlytics.pipelineStatus.status === 'step'
            ? progress.length > 0
              ? progress
              : `Generating pipeline...`
            : `Create described pipeline`}
        </Button>
      </div>
    </div>
  );
}
