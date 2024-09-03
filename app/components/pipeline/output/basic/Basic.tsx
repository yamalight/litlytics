import { OutputStep } from '@/src/step/Step';
import { useMemo } from 'react';
import { RenderResults } from '../Results';
import { BasicOutputConfig } from '../types';

export function BasicOutput({ data }: { data: OutputStep }) {
  const config = useMemo(() => data.config as BasicOutputConfig, [data]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      {config.results ? (
        <RenderResults results={config.results} />
      ) : (
        <>No results</>
      )}
    </div>
  );
}
