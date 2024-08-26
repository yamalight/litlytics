import { Button } from '@/app/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/app/components/catalyst/dialog';
import { Field, FieldGroup, Label } from '@/app/components/catalyst/fieldset';
import { Input } from '@/app/components/catalyst/input';
import { Select } from '@/app/components/catalyst/select';
import { pipelineAtom } from '@/app/store/store';
import { SourceType, SourceTypes } from '@/src/source/Source';
import { SourceStep } from '@/src/step/Step';
import { CogIcon } from '@heroicons/react/24/solid';
import { Handle, Position } from '@xyflow/react';
import { useAtom } from 'jotai';
import { ChangeEvent, useMemo, useState } from 'react';
import { BasicSource } from '../source/plain/Plain';
import { SourceRender } from '../source/types';

const SOURCE_RENDERERS: Partial<Record<SourceType, SourceRender>> = {
  [SourceTypes.BASIC]: BasicSource,
};

export function SourceNode({ data }: { data: SourceStep }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const Render = useMemo(() => SOURCE_RENDERERS[data.sourceType], [data]);

  const updateNode = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    prop: string
  ) => {
    const newVal = e.target.value;
    const newData = structuredClone(data);
    newData[prop] = newVal;

    const newSteps = pipeline.steps.map((s) => {
      if (s.id === newData.id) {
        return newData;
      }
      return s;
    });
    setPipeline({
      ...pipeline,
      steps: newSteps,
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-40 min-h-10 p-2 bg-neutral-800 rounded-lg">
        <div className="text-xs text-center">{data.name}</div>
        <Button className="h-4 w-4" onClick={() => setIsOpen(true)}>
          <CogIcon />
        </Button>
        <Handle type="source" position={Position.Bottom} id="a" />
      </div>

      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Configure {data.name}</DialogTitle>
        <DialogDescription>
          Configure parameters for source node: {data.name}
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Source name</Label>
              <Input
                name="content"
                placeholder="Source name"
                autoFocus
                value={data.name}
                onChange={(e) => updateNode(e, 'name')}
              />
            </Field>
            <Field>
              <Label>Source type</Label>
              <Select
                name="step-input"
                value={data.sourceType as string}
                onChange={(e) => updateNode(e, 'sourceType')}
              >
                {Object.keys(SourceTypes).map((type) => (
                  <option
                    key={type}
                    value={SourceTypes[type as keyof SourceTypes]}
                  >
                    {SourceTypes[type as keyof SourceTypes]}
                  </option>
                ))}
              </Select>
            </Field>
          </FieldGroup>

          {Render && (
            <div className="mt-2">
              <Render data={data} />
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
