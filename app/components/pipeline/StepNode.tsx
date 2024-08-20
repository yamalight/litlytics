import { Step } from '@/src/step/Step';
import { Handle, Position } from '@xyflow/react';
import { useCallback } from 'react';

export function StepNode({ data }: { data: Step }) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">{data.name}</label>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
