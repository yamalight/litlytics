import { pipelineAtom } from '@/app/store/store';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { OutputNode } from './nodes/OutputNode';
import { SourceNode } from './nodes/SourceNode';
import { StepNode } from './nodes/StepNode';

export function PipelineBuilder() {
  const pipeline = useAtomValue(pipelineAtom);
  console.log(pipeline);

  return (
    <div
      className={clsx(
        // size
        'w-screen h-screen p-6 overflow-auto',
        // content positioning
        'flex flex-col items-center justify-center',
        // bg dots
        'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:32px_32px]'
      )}
    >
      <SourceNode />
      {pipeline.steps.map((step) => (
        <StepNode data={step} key={step.id} />
      ))}
      <OutputNode />
    </div>
  );
}
