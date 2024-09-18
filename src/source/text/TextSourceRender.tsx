import type { Doc } from '@/src/doc/Document';
import type { SourceStep } from '@/src/step/Step';
import { type ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { Textarea } from '~/components/catalyst/textarea';
import type { TextSourceConfig } from '../Source';

export function TextSourceRender({
  source,
  setSource,
}: {
  source: SourceStep;
  setSource: (newSource: SourceStep) => void;
}) {
  const config = useMemo(() => source.config as TextSourceConfig, [source]);

  const updateDoc = useCallback(
    (doc: Doc) => {
      const newSource = structuredClone(source);
      (newSource.config as TextSourceConfig).document = doc;
      setSource(newSource);
    },
    [source, setSource]
  );

  const updateDocProp = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: Exclude<keyof Doc, 'processingResults' | 'test'>
  ) => {
    const newVal = e.target.value;
    const newDoc = structuredClone(config.document!);
    newDoc[prop] = newVal;
    updateDoc(newDoc);
  };

  useEffect(() => {
    if (config.document) {
      return;
    }

    const doc: Doc = {
      id: 'textdoc',
      name: 'Default document',
      content: '',
      processingResults: [],
    };
    updateDoc(doc);
  }, [config, updateDoc]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col">
        <Textarea
          rows={5}
          name="content"
          placeholder="Input text"
          value={config.document?.content ?? ''}
          onChange={(e) => updateDocProp(e, 'content')}
        />
      </div>
    </div>
  );
}
