'use client';

import { useEffect, useState } from 'react';
import AddProject from './components/AddProject';
import AddStep from './components/addStep/AddStep';
import { ApplicationLayout } from './components/ApplicationLayout';
import { Pipeline } from './components/pipeline/Pipeline';
import { StepItem } from './components/step/Step';
import { useStore } from './store/store';

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const state = useStore((state) => state);

  useEffect(() => {
    if (state.pipelinePlan?.length) {
      setShowHelp(true);
    }
  }, [state.pipelinePlan]);

  return (
    <main className="flex min-h-screen">
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        {!Boolean(state.projectName?.length) && <AddProject />}
        {Boolean(state.projectName?.length) && (
          <ApplicationLayout showAssist={() => setShowHelp((c) => !c)}>
            <div className="flex w-full items-center justify-center">
              <div className="flex flex-col gap-2 prose prose-sm dark:prose-invert">
                <h1>Pipeline</h1>
                {state.steps.map((s) => (
                  <StepItem key={s.id} step={s} />
                ))}
                <AddStep />
              </div>
            </div>
          </ApplicationLayout>
        )}

        {Boolean(state.pipelinePlan?.length) && showHelp && (
          <Pipeline hide={() => setShowHelp((c) => !c)} />
        )}
      </div>
    </main>
  );
}
