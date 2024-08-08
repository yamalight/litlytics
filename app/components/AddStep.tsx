'use client';

import { useRef, useState } from 'react';
import { useStore } from '../store/store';
import { Button } from './catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from './catalyst/dialog';
import { Field, FieldGroup, Label } from './catalyst/fieldset';
import { Input } from './catalyst/input';
import { Textarea } from './catalyst/textarea';

export default function AddStep() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const addStep = useStore((state) => state.addStep);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add processing step</Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add processing step</DialogTitle>
        <DialogDescription>
          Add new processing step to project
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
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
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const name = nameInputRef.current?.value;
              const description = contentInputRef.current?.value;
              // TODO: generate step from LLM

              return;
              // add
              const code = '';
              const prompt = '';
              addStep({ id: '0', type: 'llm', code, prompt });
              setIsOpen(false);
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
