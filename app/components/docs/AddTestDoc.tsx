'use client';

import { DocumentIcon } from '@heroicons/react/16/solid';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { pipelineAtom } from '../../store/store';
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
import { Textarea } from '../catalyst/textarea';

export default function AddTestDoc() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const addDoc = () => {
    const content = contentInputRef.current?.value;
    const name = nameInputRef.current?.value;
    if (content?.length && name?.length) {
      setPipeline({
        ...pipeline,
        documents: pipeline.documents.concat({
          id: String(parseInt(pipeline.documents.at(-1)?.id ?? '-1') + 1),
          name,
          content,
          processingResults: [],
        }),
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <DocumentIcon className="w-4 h-4" />
        Add document
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add document</DialogTitle>
        <DialogDescription>Add new test document to project</DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Document name</Label>
              <Input
                name="content"
                placeholder="Document name"
                autoFocus
                ref={nameInputRef}
              />
            </Field>
            <Field>
              <Label>Document content</Label>
              <Textarea
                name="content"
                placeholder="Document content"
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
          <Button onClick={addDoc}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
