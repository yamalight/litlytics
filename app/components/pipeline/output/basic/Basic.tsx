import { pipelineAtom } from '@/app/store/store';
import { OutputStep, StepResult } from '@/src/step/Step';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { RenderResults } from '../Results';
import { BasicOutputConfig } from '../types';

export function BasicOutput({ data }: { data: OutputStep }) {
  const pipeline = useAtomValue(pipelineAtom);
  const config = useMemo(() => data.config as BasicOutputConfig, [data]);
  const result = useMemo(() => {
    let results: StepResult[] = [];
    if (Array.isArray(config.results)) {
      results = config.results.map((r) => r.processingResults).flat();
    } else {
      results = config.results.processingResults;
    }

    const lastStep = pipeline.output.id;
    const res = results.find((r) => {
      const step = pipeline.steps.find((s) => s.id === r.stepId);
      return step?.connectsTo.includes(lastStep);
    });
    console.log({ lastStep, res });
    return res;
  }, [config, pipeline]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      {result ? <RenderResults result={result} /> : <>No results</>}
    </div>
  );
}
