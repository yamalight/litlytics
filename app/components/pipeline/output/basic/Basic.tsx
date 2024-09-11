import { Doc } from '@/src/doc/Document';
import { OutputStep } from '@/src/step/Step';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { pipelineAtom } from '~/store/store';
import { RenderResults } from '../Results';
import { BasicOutputConfig } from '../types';

export function BasicOutput({ data }: { data: OutputStep }) {
  const pipeline = useAtomValue(pipelineAtom);
  const config = useMemo(() => data.config as BasicOutputConfig, [data]);
  const result = useMemo(() => {
    const docs = config.results;
    if (!docs) {
      return;
    }

    const results: Doc[] = Array.isArray(docs) ? docs : [docs];
    const res = results
      .filter((doc) => doc)
      .map((doc) => {
        const d = structuredClone(doc);
        d.processingResults = d.processingResults.filter((r) => {
          const steps = pipeline.steps.filter(
            (s) =>
              s.id === r.stepId && s.connectsTo.includes(pipeline.output.id)
          );
          return steps.length > 0;
        });
        return d;
      });
    console.log(res);
    return res;
  }, [config, pipeline]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      {result ? <RenderResults docs={result} /> : <>No results</>}
    </div>
  );
}
