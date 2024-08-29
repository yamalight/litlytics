import { pipelineAtom } from '@/app/store/store';
import { Doc } from '@/src/doc/Document';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { ChangeEvent, useMemo, useState } from 'react';
import { Button } from '../catalyst/button';
import { Checkbox } from '../catalyst/checkbox';
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

export function DocItem({
  doc,
  updateDoc,
}: {
  doc: Doc;
  updateDoc: (doc: Doc) => void;
}) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isOpen, setIsOpen] = useState(false);
  const testDocs = useMemo(() => pipeline.testDocs, [pipeline]);
  const inTest = useMemo(
    () => testDocs.find((d) => d.id === doc.id) !== undefined,
    [doc, testDocs]
  );

  const toggleTest = () => {
    if (inTest) {
      const newTestDocs = testDocs.filter((d) => d.id !== doc.id);
      setPipeline({
        ...pipeline,
        testDocs: newTestDocs,
      });
    } else {
      setPipeline({
        ...pipeline,
        testDocs: pipeline.testDocs.concat(doc),
      });
    }
  };

  const updateDocProp = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: Exclude<keyof Doc, 'processingResults'>
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
          <Checkbox checked={inTest} onClick={toggleTest} /> Use as test
          <Button plain onClick={() => setIsOpen(true)} className="ml-6">
            <PencilIcon />
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
            Close
          </Button>
          <Button onClick={() => {}}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
