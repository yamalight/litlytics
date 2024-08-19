'use client';

import { useEffect, useState } from 'react';
import AddProject from './components/AddProject';
import { ApplicationLayout } from './components/ApplicationLayout';
import PipelineFlow from './components/pipeline/Flow';
import { Pipeline } from './components/pipeline/Pipeline';
import { useStore } from './store/store';

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const state = useStore((state) => state);

  useEffect(() => {
    if (state.pipeline.pipelinePlan?.length) {
      // setShowHelp(true);
    }
  }, [state.pipeline.pipelinePlan]);

  return (
    <main className="flex min-h-screen">
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        {!Boolean(state.pipeline.name?.length) && <AddProject />}
        {Boolean(state.pipeline.name?.length) && (
          <ApplicationLayout showAssist={() => setShowHelp((c) => !c)}>
            <PipelineFlow pipeline={state.pipeline} />

            {/* <div className="flex flex-col gap-2 prose prose-sm dark:prose-invert">
                <h1>Pipeline</h1>
                {state.pipeline.steps.map((s) => (
                  <StepItem key={s.id} step={s} />
                ))}
                <AddStep />
              </div> */}
          </ApplicationLayout>
        )}

        {Boolean(state.pipeline.pipelinePlan?.length) && showHelp && (
          <Pipeline hide={() => setShowHelp((c) => !c)} />
        )}
      </div>
    </main>
  );
}
