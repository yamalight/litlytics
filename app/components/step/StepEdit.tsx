import { Button } from '@/app/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/app/components/catalyst/dialog';
import { pipelineAtom } from '@/app/store/store';
import { ProcessingStep } from '@/src/step/Step';
import { CogIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { ChangeEvent, useState } from 'react';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';
import { Textarea } from '../catalyst/textarea';

export function StepEdit({ data }: { data: ProcessingStep }) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isOpen, setIsOpen] = useState(false);

  const updateNode = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: keyof ProcessingStep
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
      <Button className="h-4 w-4" onClick={() => setIsOpen(true)}>
        <CogIcon />
      </Button>

      {/* Edit step */}
      <Dialog size="3xl" open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Step: {data.name}</DialogTitle>
        <DialogDescription>Config for {data.name}.</DialogDescription>
        <DialogBody className="w-full">
          <FieldGroup>
            <Field>
              <Label>Step name</Label>
              <Input
                name="name"
                placeholder="Step name"
                autoFocus
                value={data.name}
                onChange={(e) => updateNode(e, 'name')}
              />
            </Field>
            <Field>
              <Label>Step description</Label>
              <Textarea
                name="description"
                placeholder="Step description"
                value={data.description}
                onChange={(e) => updateNode(e, 'description')}
              />
            </Field>
            {data.type === 'llm' ? (
              <Field>
                <Label>Step prompt</Label>
                <Textarea
                  rows={5}
                  name="prompt"
                  placeholder="Step prompt"
                  value={data.prompt}
                  onChange={(e) => updateNode(e, 'prompt')}
                />
              </Field>
            ) : (
              <>{data.code}</>
            )}
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
