import { useAtomValue } from 'jotai';
import { pipelineAtom } from '~/store/store';
import { Background } from '../Background';
import { OutputNode } from './nodes/OutputNode';
import { SourceNode } from './nodes/SourceNode';
import { StepNode } from './nodes/StepNode';

export function PipelineBuilder() {
  const pipeline = useAtomValue(pipelineAtom);
  console.log(pipeline);

  return (
    <Background>
      <SourceNode />
      {pipeline.steps
        .sort((a, b) => (a.connectsTo.includes(b.id) ? -1 : 1))
        .map((step) => (
          <StepNode data={step} key={step.id} />
        ))}
      <OutputNode />
    </Background>
  );
}
