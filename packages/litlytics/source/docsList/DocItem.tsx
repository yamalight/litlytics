import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { type ChangeEvent, useState } from 'react';
import type { UIComponents } from '../../components/types';
import type { Doc } from '../../doc/Document';

export function DocItem({
  doc,
  updateDoc,
  deleteDoc,
  components,
}: {
  doc: Doc;
  updateDoc: (doc: Doc) => void;
  deleteDoc: (docId: string) => void;
  components: UIComponents;
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
          <components.Checkbox checked={doc.test} onClick={toggleTest} /> Use as
          test
          <components.Button
            plain
            onClick={() => setIsOpen(true)}
            className="ml-6"
          >
            <PencilIcon />
          </components.Button>
          <components.Button
            plain
            onClick={() => deleteDoc(doc.id)}
            className="ml-1"
          >
            <TrashIcon />
          </components.Button>
        </div>
      </div>
      <components.Dialog
        size="3xl"
        open={isOpen}
        onClose={setIsOpen}
        topClassName="z-30"
      >
        <components.DialogTitle>Document view</components.DialogTitle>
        <components.DialogDescription>{doc.name}</components.DialogDescription>
        <components.DialogBody className="w-full">
          <components.FieldGroup>
            <components.Field>
              <components.Label>Document name</components.Label>
              <components.Input
                name="name"
                placeholder="Doc name"
                autoFocus
                value={doc.name}
                onChange={(
                  e: ChangeEvent<
                    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
                  >
                ) => updateDocProp(e, 'name')}
              />
            </components.Field>
            <components.Field>
              <components.Label>Document content</components.Label>
              <components.Textarea
                rows={5}
                name="description"
                placeholder="Doc content"
                value={doc.content}
                onChange={(
                  e: ChangeEvent<
                    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
                  >
                ) => updateDocProp(e, 'content')}
              />
            </components.Field>
          </components.FieldGroup>
        </components.DialogBody>
        <components.DialogActions>
          <components.Button plain onClick={() => setIsOpen(false)}>
            Done
          </components.Button>
        </components.DialogActions>
      </components.Dialog>
    </>
  );
}
