import { Doc } from 'litlytics';
import { useEffect, useMemo, useState } from 'react';
import { useLitlytics } from '~/store/store';

export function useTestDocs() {
  const litlytics = useLitlytics();
  const [allDocs, setDocs] = useState<Doc[]>([]);
  const testDocs = useMemo(() => allDocs.filter((d) => d?.test), [allDocs]);

  useEffect(() => {
    async function getTestDocs() {
      const newAllDocs = await litlytics.getDocs();
      setDocs(newAllDocs ?? []);
    }
    getTestDocs();
  }, [litlytics]);

  return { allDocs, testDocs };
}
