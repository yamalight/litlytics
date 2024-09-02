'use client';

import { PipelineBuilder } from './components/pipeline/PipelineBuilder';
import { PipelineUI } from './components/PipelineUI';

export default function Home() {
  return (
    <main className="relative min-h-screen min-w-screen">
      <PipelineUI />
      <PipelineBuilder />
    </main>
  );
}
