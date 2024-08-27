import { pipelineAtom } from '@/app/store/store';
import { pipelineToNodesAndEdges } from '@/src/pipeline/util';
import { Step } from '@/src/step/Step';
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import { SourceNode } from './nodes/SourceNode';
import { StepNode } from './nodes/StepNode';

const nodeTypes = {
  step: StepNode,
  source: SourceNode,
};

export default function PipelineFlow() {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => pipelineToNodesAndEdges(pipeline),
    [pipeline]
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      // do not add if already exists
      const existing = edges.find(
        (e) => e.source === params.source && e.target === params.target
      );
      if (existing) {
        return;
      }
      // console.log('add edge', params);
      setPipeline({
        ...pipeline,
        steps: pipeline.steps.map((s) => {
          if (s.id === params.source) {
            s.connectsTo = s.connectsTo.concat(params.target);
          }
          return s;
        }),
      });
    },
    [edges, pipeline, setPipeline]
  );

  const onNodesChangeCustom: typeof onNodesChange = useCallback(
    (nodeChanges: NodeChange<Node<Step>>[]) => {
      // console.log('Node changes:', nodeChanges);

      // handle node moving
      const movChanges = nodeChanges
        .filter((n) => n.type === 'position')
        .filter((n) => !n.dragging);
      if (movChanges.length > 0) {
        setPipeline({
          ...pipeline,
          steps: pipeline.steps.map((node) => {
            const moved = movChanges.find((c) => c.id === node.id);
            if (!moved) {
              return node;
            }
            node.position = moved.position!;
            return node;
          }),
        });
        // console.log('Nodes removed', remChanges);
      }

      // handle node removals
      const remChanges = nodeChanges.filter((n) => n.type === 'remove');
      if (remChanges.length > 0) {
        const remIds = remChanges.map((c) => c.id);
        setPipeline({
          ...pipeline,
          steps: pipeline.steps.filter((s) => !remIds.includes(s.id)),
        });
        // console.log('Nodes removed', remChanges);
      }
      return onNodesChange(nodeChanges);
    },
    [onNodesChange, pipeline, setPipeline]
  );

  const onEdgesChangeCustom: typeof onEdgesChange = useCallback(
    (edgeChanges: EdgeChange<Edge>[]) => {
      console.log('Edge changes:', edgeChanges);

      // handle edge removals
      const remChanges = edgeChanges.filter((n) => n.type === 'remove');
      if (remChanges.length > 0) {
        const edgePairs = remChanges
          .map((c) => c.id)
          .map((id) => {
            const [src, dest] = id.split('-');
            return { [src.replace('e', '')]: dest };
          })
          .reduce((acc, val) => ({ ...acc, ...val }), {});
        setPipeline({
          ...pipeline,
          steps: pipeline.steps.map((s) => {
            if (edgePairs[s.id] !== undefined) {
              s.connectsTo = s.connectsTo.filter(
                (id) => id !== edgePairs[s.id]
              );
            }
            return s;
          }),
        });
        // setTimeout(() => console.log(pipeline), 100);
        // console.log('Nodes removed', remChanges);
      }

      return onEdgesChange(edgeChanges);
    },
    [onEdgesChange, pipeline, setPipeline]
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
        onNodesChange={onNodesChangeCustom}
        onEdgesChange={onEdgesChangeCustom}
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
