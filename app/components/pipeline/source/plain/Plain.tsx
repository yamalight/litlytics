import { pipelineAtom } from '@/app/store/store';
import { Doc } from '@/src/doc/Document';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { DocItem } from '../../../docs/DocItem';
import { BasicSourceConfig } from '../types';
import AddDoc from './AddDoc';

export function BasicSource() {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const config = useMemo(
    () => pipeline.source.config as BasicSourceConfig,
    [pipeline]
  );

  const updateDoc = (doc: Doc) => {
    const newSource = structuredClone(pipeline.source);
    newSource.config.documents = config.documents?.map((d) => {
      if (d.id === doc.id) {
        return doc;
      }
      return d;
    });
    setPipeline({
      ...pipeline,
      source: newSource,
    });
  };

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col">
        {Boolean(config.documents?.length) ? (
          <>
            {config.documents?.map((doc) => (
              <DocItem doc={doc} key={doc.id} updateDoc={updateDoc} />
            ))}
          </>
        ) : (
          <>No documents</>
        )}
      </div>
      <AddDoc data={pipeline.source} />
    </div>
  );
}
