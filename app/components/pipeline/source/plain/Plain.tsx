import { pipelineAtom } from '@/app/store/store';
import { Doc } from '@/src/doc/Document';
import { SourceStep } from '@/src/step/Step';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { DocItem } from '../../../docs/DocItem';
import { BasicSourceConfig } from '../types';
import AddDoc from './AddDoc';

export function BasicSource({ data }: { data: SourceStep }) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const config = useMemo(() => data.config as BasicSourceConfig, [data]);

  const updateDoc = (doc: Doc) => {
    data.config.documents = config.documents?.map((d) => {
      if (d.id === doc.id) {
        return doc;
      }
      return d;
    });
    setPipeline({
      ...pipeline,
      steps: pipeline.steps.map((s) => {
        if (s.id === data.id) {
          return data;
        }
        return s;
      }),
    });
  };

  return (
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
      <AddDoc data={data} />
    </div>
  );
}
