'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import PipelineFlow from './components/pipeline/Flow';
import { pipelineAtom } from './store/store';

export default function Home() {
  const [pipeline] = useAtom(pipelineAtom);

  useEffect(() => {
    if (pipeline.pipelinePlan?.length) {
      // setShowHelp(true);
    }
  }, [pipeline.pipelinePlan]);

  return (
    <main className="min-h-screen min-w-screen">
      <PipelineFlow pipeline={pipeline} />
    </main>
  );
}
