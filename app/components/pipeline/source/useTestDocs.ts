import { useMemo } from 'react';
import { useLitlytics } from '~/store/WithLitLytics';

export function useTestDocs() {
  const { pipeline } = useLitlytics();
  const allDocs = useMemo(
    () => pipeline.source.docs ?? [],
    [pipeline.source.docs]
  );
  const testDocs = useMemo(() => allDocs.filter((d) => d?.test), [allDocs]);

  return { allDocs, testDocs };
}
