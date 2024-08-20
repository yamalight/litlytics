import { Edge, Node } from '@xyflow/react';
import { Step } from '../step/Step';
import { Pipeline } from './Pipeline';

export function pipelineToNodesAndEdges(pipeline: Pipeline) {
  const nodes = pipeline.steps.map((s) => ({
    id: s.id,
    position: s.position,
    type: s.type === 'source' ? 'source' : 'step',
    data: s,
  })) as Node<Step>[];
  const edges = pipeline.steps
    .map((s) =>
      s.connectsTo.map((id) => ({
        id: `e${s.id}-${id}`,
        source: s.id,
        target: id,
      }))
    )
    .flat() as Edge[];

  return { nodes, edges };
}
