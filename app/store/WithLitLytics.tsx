import { useAtom, useAtomValue } from 'jotai';
import { LitLytics } from 'litlytics';
import { createContext, useContext, useEffect, useReducer } from 'react';
import {
  configAtom,
  litlyticsAtom,
  litlyticsInitedAtom,
  webllmAtom,
} from './store';
import { createReactiveProxy } from './util';

const LitLyticsContext = createContext<{ litlytics?: LitLytics }>({
  litlytics: undefined,
});

export function WithLitLytics({ children }: { children: React.ReactNode }) {
  const webllm = useAtomValue(webllmAtom);
  const [config, setConfig] = useAtom(configAtom);
  const [isInited, setIsInited] = useAtom(litlyticsInitedAtom);
  const [litlytics, setLitlytics] = useAtom(litlyticsAtom);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // create proxy that triggers state updates
  // only create it once
  useEffect(() => {
    if (isInited) {
      return;
    }
    const ll = new LitLytics({
      provider: 'openai',
      model: 'gpt-4o-mini',
      key: '',
    });
    setLitlytics(
      createReactiveProxy(ll, () => {
        // persist changes in localStorage
        setConfig(ll.exportConfig());
        // force UI update
        forceUpdate();
      })
    );
    // set inited flag
    setIsInited(true);
    // assign initial config and webEngine instance
    console.log('set', config);
    ll.importConfig(config);
    ll.setWebEngine(webllm.engine);
  }, [isInited, config, webllm, setIsInited, setLitlytics, setConfig]);

  return (
    <LitLyticsContext.Provider value={{ litlytics }}>
      {children}
    </LitLyticsContext.Provider>
  );
}

export const useLitlytics = () => {
  const { litlytics } = useContext(LitLyticsContext);
  return litlytics!;
};
