'use client';

import PipelineFlow from './components/pipeline/Flow';
import { PipelineUI } from './components/PipelineUI';

export default function Home() {
  return (
    <main className="relative min-h-screen min-w-screen">
      <PipelineUI />
      <PipelineFlow />
    </main>
  );
}
