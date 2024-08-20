'use client';

import { pipelineAtom } from '@/app/store/store';
import { generateStep } from '@/src/step/generate';
import { StepInput } from '@/src/step/Step';
import { PlusIcon } from '@heroicons/react/16/solid';
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

export default function AddStep() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<'llm' | 'code'>('llm');
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
    <div className="flex w-full mt-4">
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        <PlusIcon className="w-4 h-4" /> Add processing step
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
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
                onChange={(e) => setType(e.target.value as 'llm' | 'code')}
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
                <option value="doc">Document</option>
                <option value="result">Previous step result</option>
                <option value="aggregate">All documents</option>
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
    </div>
  );
}
