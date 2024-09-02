import { pipelineAtom } from '@/app/store/store';
import { OutputStep } from '@/src/step/Step';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { BasicOutputConfig } from '../types';

export function BasicOutput({ data }: { data: OutputStep }) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const config = useMemo(() => data.config as BasicOutputConfig, [data]);

  return <div className="flex flex-col">Basic output render</div>;
}
