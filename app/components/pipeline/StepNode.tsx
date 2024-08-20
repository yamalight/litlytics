import { Step } from '@/src/step/Step';
import { Handle, Position } from '@xyflow/react';
import { Button } from '../catalyst/button';
import { CogIcon } from '@heroicons/react/24/solid';

export function StepNode({ data }: { data: Step }) {
  return (
    <div className="flex flex-col items-center justify-center w-40 min-h-10 p-2 bg-neutral-800 rounded-lg">
      <Handle type="target" position={Position.Top} />
      <div className="text-xs text-center">{data.name}</div>
      <Button className="h-4 w-4">
        <CogIcon />
      </Button>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
