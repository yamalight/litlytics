import { DocumentIcon } from '@heroicons/react/16/solid';
import { Doc } from 'litlytics';
import { useRef, useState } from 'react';
import { Button } from '~/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '~/components/catalyst/dialog';
import { Field, FieldGroup, Label } from '~/components/catalyst/fieldset';
import { Input } from '~/components/catalyst/input';
import { Textarea } from '~/components/catalyst/textarea';

export default function AddDoc({
  docs,
  setDocs,
}: {
  docs: Doc[];
  setDocs: (newDocs: Doc[]) => void;
}) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const addDoc = () => {
    const content = contentInputRef.current?.value;
    const name = nameInputRef.current?.value;
    if (content?.length && name?.length) {
      const newDocs = structuredClone(docs) ?? [];
      newDocs.push({
        id: String(newDocs.length + 1),
        name,
        content,
        processingResults: [],
      });
      setDocs(newDocs);
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
