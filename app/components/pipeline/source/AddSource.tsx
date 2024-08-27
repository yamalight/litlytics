import { Button } from '@/app/components/catalyst/button';
import { pipelineAtom } from '@/app/store/store';
import { SourceTypes } from '@/src/source/Source';
import { SourceStep } from '@/src/step/Step';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

export function AddSource() {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const hasSource = useMemo(
    () => pipeline.steps.find((s) => s.type === 'source') !== undefined,
    [pipeline]
  );

  const addSource = () => {
    let id = pipeline.steps.length + 2; // starting with 1 + count + 1 more;
    // generate a new id that is not already in list
    while (pipeline.steps.find((n) => n.id === `${id}`)) {
      id++;
    }
    const newSource: SourceStep = {
      id: String(id),
      type: 'source',
      sourceType: SourceTypes.BASIC,
      name: 'New source',
      description: 'New source',
      position: { x: 0, y: 0 },
      connectsTo: [],
      config: {},
    };
    setPipeline({
      ...pipeline,
      steps: pipeline.steps.concat(newSource),
    });
  };

  return (
    <>
      <Button title="Add source" disabled={hasSource} onClick={addSource}>
        <DocumentIcon aria-hidden="true" className="h-5 w-5" />
      </Button>
    </>
  );
}
