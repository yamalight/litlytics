import { useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { Textarea } from '~/components/catalyst/textarea';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';
import { useLitlytics } from '~/store/WithLitLytics';

export function RefinePipeline({ hide }: { hide: () => void }) {
  const {
    litlytics,
    pipeline,
    setPipeline,
    pipelineStatus,
    setPipelineStatus,
  } = useLitlytics();
  const [error, setError] = useState<Error>();
  const [refine, setRefine] = useState(``);
  const [progress, setProgress] = useState('');

  const doRefine = async () => {
    if (!refine?.length) {
      return;
    }

    try {
      // generate plan from LLM
      setPipelineStatus({ status: 'refine' });
      const newPipeline = await litlytics.refinePipeline({
        refineRequest: refine,
      });
      setPipeline(newPipeline);
      setPipelineStatus({ status: 'init' });
      setRefine('');
    } catch (err) {
      setError(err as Error);
      setPipelineStatus({ status: 'error' });
    }
  };

  const doCreate = async () => {
    try {
      setPipelineStatus({ status: 'sourcing' });
      // generate plan from LLM
      const newPipeline = await litlytics.pipelineFromText(
        ({ step, totalSteps }) => {
          if (step > totalSteps) {
            setProgress('');
            return;
          }

          setProgress(`Generating steps: ${step} / ${totalSteps}`);
        }
      );
      setPipeline(newPipeline);
      setPipelineStatus({ status: 'done' });
      hide();
    } catch (err) {
      setError(err as Error);
      setPipelineStatus({ status: 'error' });
    }
  };

  const inProgress =
    pipelineStatus.status === 'refine' ||
    pipelineStatus.status === 'sourcing' ||
    pipelineStatus.status === 'step';

  return (
    <div className="w-full h-full p-4 prose prose-sm prose-no-nr dark:prose-invert ">
      <div className="flex w-full items-center justify-between">
        <h1 className="m-0">Suggested pipeline:</h1>
      </div>

      <CustomMarkdown>{`${pipeline.pipelinePlan}`}</CustomMarkdown>
      <div className="flex gap-1">
        <Textarea
          rows={2}
          placeholder="Your request..."
          disabled={inProgress}
          value={refine}
          onChange={(e) => setRefine(e.target.value)}
        />
        <Button onClick={doRefine} disabled={inProgress}>
          {pipelineStatus.status === 'refine' && (
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
          {(pipelineStatus.status === 'sourcing' ||
            pipelineStatus.status === 'step') && (
            <div className="flex items-center">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          {pipelineStatus.status === 'sourcing' ||
          pipelineStatus.status === 'step'
            ? progress.length > 0
              ? progress
              : `Generating pipeline...`
            : `Create described pipeline`}
        </Button>
      </div>
    </div>
  );
}
