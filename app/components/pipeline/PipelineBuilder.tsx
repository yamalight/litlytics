import { useLitlytics } from '~/store/WithLitLytics';
import { Background } from '../Background';
import { OutputNode } from './nodes/output/OutputNode';
import { SourceNode } from './nodes/source/SourceNode';
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
