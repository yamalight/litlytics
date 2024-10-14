import { Doc } from 'litlytics';
import { type ChangeEvent } from 'react';
import { Textarea } from '~/components/catalyst/textarea';

export function TextSourceRender({
  docs,
  setDocs,
}: {
  docs: Doc[];
  setDocs: (newDocs: Doc[]) => void;
}) {
  const updateDocProp = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: Exclude<keyof Doc, 'processingResults' | 'test'>
  ) => {
    const newVal = e.target.value;
    const newDoc = structuredClone(
      docs.at(0) ?? {
        id: 'textdoc',
        name: 'Default document',
        content: '',
        test: true,
        processingResults: [],
      }
    );
    newDoc[prop] = newVal;
    setDocs([newDoc]);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col">
        <Textarea
          rows={5}
          name="content"
          placeholder="Input text"
          value={docs?.at(0)?.content ?? ''}
          onChange={(e) => updateDocProp(e, 'content')}
        />
      </div>
    </div>
  );
}
