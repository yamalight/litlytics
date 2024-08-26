import { SourceStep } from '@/src/step/Step';
import { useMemo } from 'react';
import { DocItem } from '../../../docs/DocItem';
import { BasicSourceConfig } from '../types';
import AddDoc from './AddDoc';

export function BasicSource({ data }: { data: SourceStep }) {
  const config = useMemo(() => data.config as BasicSourceConfig, [data]);

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
