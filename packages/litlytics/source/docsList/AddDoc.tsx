import { DocumentIcon } from '@heroicons/react/16/solid';
import { useRef, useState } from 'react';
import type { UIComponents } from '../../components/types';
import type { SourceStep } from '../../step/Step';
import type { DocsListSourceConfig } from './types';

export default function AddDoc({
  source,
  setSource,
  components,
}: {
  source: SourceStep;
  setSource: (newSource: SourceStep) => void;
  components: UIComponents;
}) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const addDoc = () => {
    const content = contentInputRef.current?.value;
    const name = nameInputRef.current?.value;
    if (content?.length && name?.length) {
      const newConfig = structuredClone(source.config) as DocsListSourceConfig;
      if (!newConfig.documents) {
        newConfig.documents = [];
      }
      newConfig.documents.push({
        id: String(newConfig.documents?.length ?? '0' + 1),
        name,
        content,
        processingResults: [],
      });
      setSource({
        ...source,
        config: newConfig,
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <components.Button onClick={() => setIsOpen(true)} className="mt-2">
        <DocumentIcon className="w-4 h-4" />
        Add document
      </components.Button>
      <components.Dialog open={isOpen} onClose={setIsOpen} topClassName="z-40">
        <components.DialogTitle>Add document</components.DialogTitle>
        <components.DialogDescription>
          Add new test document to project
        </components.DialogDescription>
        <components.DialogBody>
          <components.FieldGroup>
            <components.Field>
              <components.Label>Document name</components.Label>
              <components.Input
                name="content"
                placeholder="Document name"
                autoFocus
                ref={nameInputRef}
              />
            </components.Field>
            <components.Field>
              <components.Label>Document content</components.Label>
              <components.Textarea
                rows={5}
                name="content"
                placeholder="Document content"
                autoFocus
                ref={contentInputRef}
              />
            </components.Field>
          </components.FieldGroup>
        </components.DialogBody>
        <components.DialogActions>
          <components.Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </components.Button>
          <components.Button onClick={addDoc}>Create</components.Button>
        </components.DialogActions>
      </components.Dialog>
    </>
  );
}
