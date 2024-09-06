import { Doc } from '@/src/doc/Document';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { DocItem } from '~/components/docs/DocItem';
import { pipelineAtom } from '~/store/store';
import { DocsListSourceConfig } from '../types';
import AddDoc from './AddDoc';

export function DocsListSource() {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const config = useMemo(
    () => pipeline.source.config as DocsListSourceConfig,
    [pipeline]
  );

  const updateDoc = (doc: Doc) => {
    const newSource = structuredClone(pipeline.source);
    (newSource.config as DocsListSourceConfig).documents =
      config.documents?.map((d) => {
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
        {config.documents?.length ? (
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
