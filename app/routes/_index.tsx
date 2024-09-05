import type { MetaFunction } from '@remix-run/node';
import { PipelineBuilder } from '~/components/pipeline/PipelineBuilder';
import { PipelineUI } from '~/components/PipelineUI';

export const meta: MetaFunction = () => {
  return [
    { title: '🔥 LitLytics' },
    { name: 'description', content: 'Welcome to 🔥 LitLytics!' },
  ];
};

export default function Index() {
  return (
    <main className="relative min-h-screen min-w-screen">
      <PipelineUI />
      <PipelineBuilder />
    </main>
  );
}
