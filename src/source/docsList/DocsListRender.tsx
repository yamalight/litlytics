import type { Doc } from '@/src/doc/Document';
import { SourceStep } from '@/src/step/Step';
import { useMemo } from 'react';
import AddDoc from './AddDoc';
import { DocItem } from './DocItem';
import type { DocsListSourceConfig } from './types';

export function DocsListSourceRender({
  source,
  setSource,
}: {
  source: SourceStep;
  setSource: (newSource: SourceStep) => void;
}) {
  const config = useMemo(() => source.config as DocsListSourceConfig, [source]);

  const updateDoc = (doc: Doc) => {
    const newSource = structuredClone(source);
    (newSource.config as DocsListSourceConfig).documents =
      config.documents?.map((d) => {
        if (d.id === doc.id) {
          return doc;
        }
        return d;
      });
    setSource(newSource);
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
      <AddDoc source={source} setSource={setSource} />
    </div>
  );
}
