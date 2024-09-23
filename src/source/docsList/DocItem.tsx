import { Doc } from '@/src/doc/Document';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ChangeEvent, useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { Checkbox } from '~/components/catalyst/checkbox';
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

export function DocItem({
  doc,
  updateDoc,
  deleteDoc,
}: {
  doc: Doc;
  updateDoc: (doc: Doc) => void;
  deleteDoc: (docId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTest = async () => {
    const newDoc = structuredClone(doc);
    newDoc.test = !newDoc.test;
    updateDoc(newDoc);
  };

  const updateDocProp = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: Exclude<keyof Doc, 'processingResults' | 'test'>
  ) => {
    const newVal = e.target.value;
    const newDoc = structuredClone(doc);
    newDoc[prop] = newVal;
    updateDoc(newDoc);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span>{doc.name}</span>
        <div className="flex items-center gap-1">
          <Checkbox checked={doc.test} onClick={toggleTest} /> Use as test
          <Button plain onClick={() => setIsOpen(true)} className="ml-6">
            <PencilIcon />
          </Button>
          <Button plain onClick={() => deleteDoc(doc.id)} className="ml-1">
            <TrashIcon />
          </Button>
        </div>
      </div>
      <Dialog size="3xl" open={isOpen} onClose={setIsOpen} topClassName="z-30">
        <DialogTitle>Document view</DialogTitle>
        <DialogDescription>{doc.name}</DialogDescription>
        <DialogBody className="w-full">
          <FieldGroup>
            <Field>
              <Label>Document name</Label>
              <Input
                name="name"
                placeholder="Doc name"
                autoFocus
                value={doc.name}
                onChange={(e) => updateDocProp(e, 'name')}
              />
            </Field>
            <Field>
              <Label>Document content</Label>
              <Textarea
                rows={5}
                name="description"
                placeholder="Doc content"
                value={doc.content}
                onChange={(e) => updateDocProp(e, 'content')}
              />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
