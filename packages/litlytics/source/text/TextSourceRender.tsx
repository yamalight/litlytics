import { type ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import type { UIComponents } from '../../components/types';
import type { Doc } from '../../doc/Document';
import type { SourceStep } from '../../step/Step';
import type { TextSourceConfig } from './types';

export function TextSourceRender({
  source,
  setSource,
  components,
}: {
  source: SourceStep;
  setSource: (newSource: SourceStep) => void;
  components: UIComponents;
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
    e: ChangeEvent<HTMLTextAreaElement>,
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
      test: true,
      processingResults: [],
    };
    updateDoc(doc);
  }, [config, updateDoc]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col">
        <components.Textarea
          rows={5}
          name="content"
          placeholder="Input text"
          value={config.document?.content ?? ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            updateDocProp(e, 'content')
          }
        />
      </div>
    </div>
  );
}
