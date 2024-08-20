'use client';

import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { pipelineAtom } from '../store/store';
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
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
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
                setPipeline({
                  ...pipeline,
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
