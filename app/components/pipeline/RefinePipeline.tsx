import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { Textarea } from '~/components/catalyst/textarea';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';
import {
  litlyticsStore,
  pipelineAtom,
  pipelineStatusAtom,
} from '~/store/store';

export function RefinePipeline({ hide }: { hide: () => void }) {
  const litlytics = useAtomValue(litlyticsStore);
  const [status, setStatus] = useAtom(pipelineStatusAtom);
  const [error, setError] = useState<Error>();
  const [refine, setRefine] = useState(``);
  const [progress, setProgress] = useState('');
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const doRefine = async () => {
    if (!refine?.length) {
      return;
    }

    try {
      setStatus((s) => ({ ...s, status: 'refine' }));

      // generate plan from LLM
      const plan = await litlytics.refinePipeline({
        refineRequest: refine,
        pipeline,
      });

      // save
      setPipeline({
        ...pipeline,
        pipelinePlan: plan ?? '',
      });
      setRefine('');
      setStatus((s) => ({ ...s, status: 'init' }));
    } catch (err) {
      setError(err as Error);
      setStatus((s) => ({ ...s, status: 'error' }));
    }
  };

  const doCreate = async () => {
    if (!pipeline.pipelinePlan?.length) {
      return;
    }

    try {
      // generate plan from LLM
      setStatus((s) => ({ ...s, status: 'sourcing' }));
      const newSteps = await litlytics.pipelineFromText(
        pipeline.pipelinePlan,
        ({ step, totalSteps }) => {
          if (step > totalSteps) {
            setProgress('');
            return;
          }

          setProgress(`Generating steps: ${step} / ${totalSteps}`);
        }
      );

      // assign output to last step
      newSteps.at(-1)!.connectsTo = [pipeline.output.id];

      // save
      setPipeline({
        ...pipeline,
        // assign input to first step
        source: {
          ...pipeline.source,
          connectsTo: [newSteps.at(0)!.id],
        },
        // assign steps
        steps: newSteps,
      });
      setStatus((s) => ({ ...s, status: 'done' }));
      hide();
    } catch (err) {
      setError(err as Error);
      setStatus((s) => ({ ...s, status: 'error' }));
    }
  };

  const inProgress =
    status.status === 'refine' ||
    status.status === 'sourcing' ||
    status.status === 'step';

  return (
    <div className="w-full h-full p-4 prose prose-sm prose-no-nr dark:prose-invert ">
      <div className="flex w-full items-center justify-between">
        <h1 className="m-0">Suggested pipeline:</h1>
      </div>

      <CustomMarkdown>{pipeline.pipelinePlan}</CustomMarkdown>
      <div className="flex gap-1">
        <Textarea
          rows={2}
          placeholder="Your request..."
          disabled={inProgress}
          value={refine}
          onChange={(e) => setRefine(e.target.value)}
        />
        <Button onClick={doRefine} disabled={inProgress}>
          {status.status === 'refine' && <Spinner className="h-5 w-5" />}
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
          {(status.status === 'sourcing' || status.status === 'step') && (
            <div className="flex items-center">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          {status.status === 'sourcing' || status.status === 'step'
            ? progress.length > 0
              ? progress
              : `Generating pipeline...`
            : `Create described pipeline`}
        </Button>
      </div>
    </div>
  );
}
