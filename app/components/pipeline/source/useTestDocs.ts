import { useAtomValue } from 'jotai';
import { Doc, Pipeline } from 'litlytics';
import { useEffect, useMemo, useState } from 'react';
import { litlyticsStore } from '~/store/store';

export function useTestDocs(pipeline: Pipeline) {
  const litlytics = useAtomValue(litlyticsStore);
  const [allDocs, setDocs] = useState<Doc[]>([]);
  const testDocs = useMemo(() => allDocs.filter((d) => d?.test), [allDocs]);

  useEffect(() => {
    async function getTestDocs() {
      const newAllDocs = await litlytics.getDocs(pipeline);
      setDocs(newAllDocs ?? []);
    }
    getTestDocs();
  }, [pipeline, litlytics]);

  return { allDocs, testDocs };
}
