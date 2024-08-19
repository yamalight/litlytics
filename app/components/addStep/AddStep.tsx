'use client';

import { Step, StepInput } from '@/src/step/Step';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useRef, useState } from 'react';
import { useStore } from '../../store/store';
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
import { runPrompt } from '../util';
import codeSystem from './code-step.txt';
import llmSystem from './llm-step.txt';

export default function AddStep() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<'llm' | 'code'>('llm');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<StepInput>('doc');
  const state = useStore((state) => state);
  const addStep = useStore((state) => state.addStep);

  const createStep = async () => {
    const name = nameInputRef.current?.value;
    const description = contentInputRef.current?.value;
    if (!name?.length || !description?.length) {
      return;
    }

    setLoading(true);

    // create user prompt
    const user = `Step name: ${name}
Step description: ${description}`;

    // determine system prompt based on step type
    const system = type === 'llm' ? llmSystem : codeSystem;

    // generate plan from LLM
    const step = await runPrompt({ system, user });

    const newStep: Step = {
      id: String(state.steps.length),
      name,
      description,
      type,
      input,
      code: type === 'code' ? step.result ?? '' : '',
      prompt: type === 'llm' ? step.result ?? '' : '',
    };
    console.log(newStep);

    // add
    addStep(newStep);
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
