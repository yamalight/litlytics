'use client';

import Markdown from 'react-markdown';
import AddProject from './components/AddProject';
import AddStep from './components/addStep/AddStep';
import AddTestDoc from './components/AddTestDoc';
import PlanPipeline from './components/pipeline/PlanPipeline';
import { StepItem } from './components/step/Step';
import { useStore } from './store/store';

export default function Home() {
  const state = useStore((state) => state);

  return (
    <main className="flex min-h-screen">
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        {!Boolean(state.projectName?.length) && <AddProject />}
        {Boolean(state.projectName?.length) &&
          !Boolean(state.testDocs?.length) && (
            <div className="flex flex-col gap-2">
              <div>Working on {state.projectName}</div>
              <AddTestDoc />
            </div>
          )}
        {Boolean(state.testDocs?.length) && (
          <div className="flex w-full items-center justify-center">
            <div className="flex flex-col gap-2">
              <div>Working on {state.projectName}</div>
              <div>
                Docs:{' '}
                {state.testDocs.map((d) => (
                  <div key={d.id}>{d.name}</div>
                ))}
                <AddTestDoc />
              </div>
              <div>
                Steps:
                {state.steps.map((s) => (
                  <StepItem key={s.id} step={s} />
                ))}
              </div>
              <div>
                {!Boolean(state.pipelinePlan?.length) && <PlanPipeline />}
                {Boolean(state.pipelinePlan?.length) && <AddStep />}
              </div>
            </div>
          </div>
        )}

        {Boolean(state.pipelinePlan?.length) && (
          <div className="w-5/12 h-full max-h-screen overflow-auto p-4 prose prose-sm dark:prose-invert lg:bg-zinc-200 dark:bg-zinc-800 dark:lg:bg-zinc-800">
            <h1>Suggested pipeline:</h1>
            <Markdown>{state.pipelinePlan}</Markdown>
          </div>
        )}
      </div>
    </main>
  );
}
