import { pipelineAtom } from '@/app/store/store';
import { pipelineFromText } from '@/src/pipeline/fromText';
import { refinePipeline } from '@/src/pipeline/refine';
import { Step } from '@/src/step/Step';
import { useAtom } from 'jotai';
import { useState } from 'react';
import Markdown from 'react-markdown';
import { Button } from '../catalyst/button';
import { Textarea } from '../catalyst/textarea';
import { Spinner } from '../Spinner';

export function RefinePipeline({ hide }: { hide: () => void }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [refine, setRefine] = useState(
    `Let's remove frequency count step and add a new code step after Step 1 to filter out positive reviews.`
  );
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const doRefine = async () => {
    if (!refine?.length) {
      return;
    }

    setLoading(true);

    // generate plan from LLM
    const plan = await refinePipeline({ refineRequest: refine, pipeline });

    // save
    setPipeline({
      ...pipeline,
      pipelinePlan: plan ?? '',
    });
    setLoading(false);
  };

  const doCreate = async () => {
    if (!pipeline.pipelinePlan?.length) {
      return;
    }

    setLoading(true);

    // generate plan from LLM
    setStatus('Generating pipeline');
    // TODO: simple text->pipeline doesn't work
    // we need to split it into multiple phases
    // phase 1: description -> steps list
    // phase 2: step -> step JSON
    // phase 3: pipeline from new steps
    const plan = await pipelineFromText(pipeline.pipelinePlan);
    const data = plan.answers.at(0)?.message.parsed as unknown as {
      steps: Step[];
    };
    const newPipeline = data.steps.map((step) => {
      if (step.type === 'source') {
        delete step.input;
        delete step.prompt;
        delete step.code;
      } else {
        delete step.sourceType;
        delete step.config;
      }
      return step;
    });
    console.log(newPipeline);

    /* setStatus('Generating steps');
    for (const step of newPipeline) {
      if (step.type === 'source') {
        continue;
      }
      console.log('gen step', step);
      const newStep = await generateStep({
        id: step.id,
        name: step.name,
        description: step.description,
        input: step.input as StepInput,
        type: step.type as ProcessingStepTypes,
      });
      console.log('new step', newStep);
    } */

    // save
    // setPipeline({
    //   ...pipeline,
    // });
    setLoading(false);
    setStatus('');
  };

  return (
    <div className="w-full h-full p-4 prose prose-sm dark:prose-invert ">
      <div className="flex w-full items-center justify-between">
        <h1 className="m-0">Suggested pipeline:</h1>
      </div>

      <Markdown>{pipeline.pipelinePlan}</Markdown>
      <div className="flex gap-1">
        <Textarea
          rows={2}
          placeholder="Your request..."
          disabled={loading}
          value={refine}
          onChange={(e) => setRefine(e.target.value)}
        />
        <Button onClick={doRefine} disabled={loading}>
          {loading && <Spinner className="h-5 w-5" />}
          Refine
        </Button>
      </div>

      <div className="flex mt-2">
        <Button onClick={doCreate} disabled={loading}>
          {loading && (
            <div className="flex items-center">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          {status.length > 0 ? status : `Create described pipeline`}
        </Button>
      </div>
    </div>
  );
}
