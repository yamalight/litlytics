'use client';

import { useAtom } from 'jotai';
import PipelineFlow from './components/pipeline/Flow';
import { PipelineUI } from './components/PipelineUI';
import { pipelineAtom } from './store/store';

export default function Home() {
  const [pipeline] = useAtom(pipelineAtom);

  return (
    <main className="relative min-h-screen min-w-screen">
      <PipelineUI />
      <PipelineFlow pipeline={pipeline} />
    </main>
  );
}
