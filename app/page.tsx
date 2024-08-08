'use client';

import { XMarkIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import Markdown from 'react-markdown';
import AddProject from './components/AddProject';
import AddStep from './components/addStep/AddStep';
import AddTestDoc from './components/AddTestDoc';
import { ApplicationLayout } from './components/ApplicationLayout';
import { Button } from './components/catalyst/button';
import { Sidebar } from './components/catalyst/sidebar';
import { StepItem } from './components/step/Step';
import { useStore } from './store/store';

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
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
          <Sidebar className="w-5/12 h-full min-h-screen max-h-screen overflow-auto p-4 prose prose-sm dark:prose-invert lg:bg-zinc-200 dark:bg-zinc-800 dark:lg:bg-zinc-800">
            <div className="flex w-full items-center justify-between">
              <h1 className="m-0">Suggested pipeline:</h1>
              <Button plain onClick={() => setShowHelp(false)}>
                <XMarkIcon />
              </Button>
            </div>

            <Markdown>{state.pipelinePlan}</Markdown>
          </Sidebar>
        )}
      </div>
    </main>
  );
}
