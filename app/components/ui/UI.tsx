import { LitLytics } from '@/src/litlytics';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { PipelineBuilder } from '~/components/pipeline/PipelineBuilder';
import { OverlayUI } from '~/components/ui/Overlay';
import {
  litlyticsConfigStore,
  litlyticsStore,
  webllmAtom,
} from '~/store/store';
import { Background } from '../Background';
import { Spinner } from '../Spinner';

// client-side only render to prevent hydration errors
// required since config is stored in localstorage so hydrating is guaranteed to fail
// if user has data in localstorage
function ClientOnly({ children }: { children: React.ReactNode }) {
  const config = useAtomValue(litlyticsConfigStore);
  const webllm = useAtomValue(webllmAtom);
  const setLitlytics = useSetAtom(litlyticsStore);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const newLL = new LitLytics(config);
    setLitlytics(newLL);
  }, [config, webllm, setLitlytics]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <main className="relative min-h-screen min-w-screen">
        <Background className="items-center justify-center">
          <Spinner /> Loading...
        </Background>
      </main>
    );
  }

  return <main className="relative min-h-screen min-w-screen">{children}</main>;
}

export function UI() {
  return (
    <ClientOnly>
      <OverlayUI />
      <PipelineBuilder />
    </ClientOnly>
  );
}
