import { Textarea } from '@/app/components/catalyst/textarea';
import { pipelineAtom } from '@/app/store/store';
import { Doc } from '@/src/doc/Document';
import { useAtom } from 'jotai';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { TextSourceConfig } from '../types';

export function TextSource() {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const config = useMemo(
    () => pipeline.source.config as TextSourceConfig,
    [pipeline]
  );

  const updateDoc = useCallback(
    (doc: Doc) => {
      const newSource = structuredClone(pipeline.source);
      newSource.config.document = doc;
      setPipeline({
        ...pipeline,
        testDocs: [doc],
        source: newSource,
      });
    },
    [pipeline, setPipeline]
  );

  const updateDocProp = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: Exclude<keyof Doc, 'processingResults'>
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
