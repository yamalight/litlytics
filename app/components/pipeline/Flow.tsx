import { Pipeline } from '@/src/pipeline/Pipeline';
import { pipelineToNodesAndEdges } from '@/src/pipeline/util';
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo } from 'react';
import { SourceNode } from './SourceNode';
import { StepNode } from './StepNode';

const nodeTypes = {
  step: StepNode,
  source: SourceNode,
};

export default function PipelineFlow({ pipeline }: { pipeline: Pipeline }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => pipelineToNodesAndEdges(pipeline),
    [pipeline]
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const { nodes, edges } = pipelineToNodesAndEdges(pipeline);
    setNodes(nodes);
    setEdges(edges);
  }, [pipeline, setNodes, setEdges]);

  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={'dark'}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls showZoom={false} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
