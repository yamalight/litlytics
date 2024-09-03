'use client';

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
import { Textarea } from '@/app/components/catalyst/textarea';
import { pipelineAtom } from '@/app/store/store';
import { SourceStep } from '@/src/step/Step';
import { DocumentIcon } from '@heroicons/react/16/solid';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { DocsListSourceConfig } from '../types';

export default function AddDoc({ data }: { data: SourceStep }) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const addDoc = () => {
    const content = contentInputRef.current?.value;
    const name = nameInputRef.current?.value;
    if (content?.length && name?.length) {
      const newConfig = structuredClone(data.config) as DocsListSourceConfig;
      if (!newConfig.documents) {
        newConfig.documents = [];
      }
      newConfig.documents.push({
        id: String(newConfig.documents?.length ?? '0' + 1),
        name,
        content,
        processingResults: [],
      });
      setPipeline({
        ...pipeline,
        source: {
          ...pipeline.source,
          config: newConfig,
        },
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="mt-2">
        <DocumentIcon className="w-4 h-4" />
        Add document
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-40">
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
                rows={5}
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
