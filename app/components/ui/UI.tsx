import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { PipelineBuilder } from '~/components/pipeline/PipelineBuilder';
import { OverlayUI } from '~/components/ui/Overlay';
import { uiLayoutAtom } from '~/store/store';
import { WithLitLytics } from '~/store/WithLitLytics';
import { AgentUI } from '../agent/Agent';
import { Background } from '../Background';
import { Spinner } from '../Spinner';

// client-side only render to prevent hydration errors
// required since config is stored in localstorage so hydrating is guaranteed to fail
// if user has data in localstorage
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <main className="relative min-h-screen min-w-screen">
        <Background className="items-center justify-center min-h-screen min-w-screen">
          <Spinner /> Loading...
        </Background>
      </main>
    );
  }

  return (
    <WithLitLytics>
      <main className="relative min-h-screen min-w-screen">{children}</main>
    </WithLitLytics>
  );
}

export function UI() {
  const uiLayout = useAtomValue(uiLayoutAtom);

  return (
    <ClientOnly>
      <OverlayUI />
      {uiLayout === 'execution' && <PipelineBuilder />}
      {uiLayout === 'agent' && <AgentUI />}
    </ClientOnly>
  );
}
