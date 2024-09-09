import { pipelineFromText } from '@/src/pipeline/fromText';
import { refinePipeline } from '@/src/pipeline/refine';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { Textarea } from '~/components/catalyst/textarea';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';
import { pipelineAtom } from '~/store/store';

export function RefinePipeline({ hide }: { hide: () => void }) {
  const [status, setStatus] = useState<'refine-loading' | 'generating' | ''>(
    ''
  );
  const [refine, setRefine] = useState(``);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const doRefine = async () => {
    if (!refine?.length) {
      return;
    }

    setStatus('refine-loading');

    // generate plan from LLM
    const plan = await refinePipeline({ refineRequest: refine, pipeline });

    // save
    setPipeline({
      ...pipeline,
      pipelinePlan: plan ?? '',
    });
    setStatus('');
  };

  const doCreate = async () => {
    if (!pipeline.pipelinePlan?.length) {
      return;
    }

    // generate plan from LLM
    setStatus('generating');
    const newSteps = await pipelineFromText(pipeline.pipelinePlan);

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
    setStatus('');
    hide();
  };

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
          disabled={status === 'refine-loading' || status === 'generating'}
          value={refine}
          onChange={(e) => setRefine(e.target.value)}
        />
        <Button
          onClick={doRefine}
          disabled={status === 'refine-loading' || status === 'generating'}
        >
          {status === 'refine-loading' && <Spinner className="h-5 w-5" />}
          Refine
        </Button>
      </div>

      <div className="flex mt-8">
        <Button
          onClick={doCreate}
          disabled={status === 'refine-loading' || status === 'generating'}
        >
          {status === 'generating' && (
            <div className="flex items-center">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          {status === 'generating'
            ? `Generating pipeline...`
            : `Create described pipeline`}
        </Button>
      </div>
    </div>
  );
}
