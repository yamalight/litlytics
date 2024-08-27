'use client';

import { pipelineAtom } from '@/app/store/store';
import { generateStep } from '@/src/step/generate';
import { ProcessingStepTypes, StepInput, StepInputs } from '@/src/step/Step';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Button } from '../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';
import { Select } from '../catalyst/select';
import { Textarea } from '../catalyst/textarea';
import { Spinner } from '../Spinner';

const stepInputLabels = {
  doc: 'Document',
  result: 'Previous step result',
  'aggregate-docs': 'All documents',
  'aggregate-results': 'All previous results',
};

export default function AddStep() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<ProcessingStepTypes>('llm');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<StepInput>('doc');
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const createStep = async () => {
    const name = nameInputRef.current?.value;
    const description = contentInputRef.current?.value;
    if (!name?.length || !description?.length) {
      return;
    }

    setLoading(true);
    const newStep = await generateStep({
      id: String(pipeline.steps.length),
      name,
      description,
      input,
      type,
    });

    // add
    setPipeline({
      ...pipeline,
      steps: pipeline.steps.concat(newStep),
    });
    setIsOpen(false);
    setLoading(false);
  };

  return (
    <>
      <Button title="Add step" onClick={() => setIsOpen(true)}>
        <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Add processing step</DialogTitle>
        <DialogDescription>
          Add new processing step to project
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Step type</Label>
              <Select
                aria-label="Step type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value as ProcessingStepTypes)}
              >
                <option value="llm">LLM</option>
                <option value="code">Code</option>
              </Select>
            </Field>
            <Field>
              <Label>Step name</Label>
              <Input
                name="content"
                placeholder="Step name"
                autoFocus
                ref={nameInputRef}
              />
            </Field>
            <Field>
              <Label>Step description</Label>
              <Textarea
                name="content"
                placeholder="Step description"
                autoFocus
                ref={contentInputRef}
              />
            </Field>
            <Field>
              <Label>Step input</Label>
              <Select
                name="step-input"
                value={input}
                onChange={(e) => setInput(e.target.value as StepInput)}
              >
                {Object.keys(StepInputs).map((key) => (
                  <option key={key} value={StepInputs[key as keyof StepInputs]}>
                    {stepInputLabels[StepInputs[key as keyof StepInputs]]}
                  </option>
                ))}
              </Select>
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          {loading && (
            <div className="flex flex-1">
              <Spinner />
            </div>
          )}
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={createStep}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
