import { SourceStep } from '@/src/step/Step';
import { useMemo } from 'react';
import { DocItem } from '../../../docs/DocItem';
import { PlainSourceConfig } from '../types';
import AddDoc from './AddDoc';

export function PlainSource({ data }: { data: SourceStep }) {
  const config = useMemo(() => data.config as PlainSourceConfig, [data]);

  return (
    <div className="flex flex-col">
      {Boolean(config.documents?.length) ? (
        <>
          {config.documents?.map((doc) => (
            <DocItem doc={doc} key={doc.id} />
          ))}
        </>
      ) : (
        <>No documents</>
      )}
      <AddDoc data={data} />
    </div>
  );
}
