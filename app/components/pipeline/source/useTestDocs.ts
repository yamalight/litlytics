import { useMemo } from 'react';
import { useLitlytics } from '~/store/WithLitLytics';

export function useTestDocs() {
  const litlytics = useLitlytics();
  const allDocs = useMemo(
    () => litlytics.pipeline.source.docs,
    [litlytics.pipeline.source.docs]
  );
  const testDocs = useMemo(() => allDocs.filter((d) => d?.test), [allDocs]);

  return { allDocs, testDocs };
}
