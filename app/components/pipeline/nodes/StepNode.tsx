import { ProcessingStep } from '@/src/step/Step';
import { Handle, Position } from '@xyflow/react';
import { StepEdit } from '../../step/StepEdit';
import { StepTest } from '../../step/StepTest';

export function StepNode({ data }: { data: ProcessingStep }) {
  return (
    <div className="flex flex-col items-center justify-center w-40 min-h-10 p-2 bg-neutral-800 rounded-lg">
      <Handle type="target" position={Position.Top} />
      <div className="text-xs text-center">{data.name}</div>
      <div className="flex gap-1 items-center m-0.5">
        <StepTest data={data} />
        <StepEdit data={data} />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
