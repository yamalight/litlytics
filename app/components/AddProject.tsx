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

export default function AddProject() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const state = useStore((state) => state);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create new project</Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Create new project</DialogTitle>
        <DialogDescription>
          Create new data processing project
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Project Name</Label>
              <Input
                name="name"
                placeholder="Project name"
                autoFocus
                ref={nameInputRef}
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
              if (name?.length) {
                state.setPipeline({
                  ...state.pipeline,
                  name,
                });
                setIsOpen(false);
              }
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
