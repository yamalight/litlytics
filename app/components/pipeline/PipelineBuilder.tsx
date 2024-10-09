import { useLitlytics } from '~/store/store';
import { Background } from '../Background';
import { OutputNode } from './nodes/OutputNode';
import { SourceNode } from './nodes/SourceNode';
import { StepNode } from './nodes/StepNode';

export function PipelineBuilder() {
  const litlytics = useLitlytics();

  return (
    <Background>
      <SourceNode />
      {litlytics.pipeline.steps
        .sort((a, b) => (a.connectsTo.includes(b.id) ? -1 : 1))
        .map((step) => (
          <StepNode data={step} key={step.id} />
        ))}
      <OutputNode />
    </Background>
  );
}
