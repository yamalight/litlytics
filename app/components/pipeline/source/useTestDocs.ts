import { Doc } from '@/packages/src/doc/Document';
import { Pipeline } from '@/packages/src/pipeline/Pipeline';
import { getDocs } from '@/packages/src/source/getDocs';
import { useEffect, useMemo, useState } from 'react';

export function useTestDocs(pipeline: Pipeline) {
  const [allDocs, setDocs] = useState<Doc[]>([]);
  const testDocs = useMemo(() => allDocs.filter((d) => d?.test), [allDocs]);

  useEffect(() => {
    async function getTestDocs() {
      const newAllDocs = await getDocs(pipeline);
      setDocs(newAllDocs ?? []);
    }
    getTestDocs();
  }, [pipeline]);

  return { allDocs, testDocs };
}
