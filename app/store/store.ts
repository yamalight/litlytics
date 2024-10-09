import { atom, useAtom, useAtomValue } from 'jotai';
import { withUndo } from 'jotai-history';
import { atomWithStorage } from 'jotai/utils';
import { LitLytics, LitLyticsConfig, MLCEngine } from 'litlytics';
import { useEffect, useReducer } from 'react';
import { createReactiveProxy } from './util';

export const configAtom = atomWithStorage<LitLyticsConfig>(
  'litltyics.config',
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    llmKey: '',
    pipeline: undefined,
  },
  undefined,
  { getOnInit: true }
);
export const configUndoAtom = withUndo(configAtom, 10);

export const litlyticsAtom = atom<LitLytics>(
  new LitLytics({
    provider: 'openai',
    model: 'gpt-4o-mini',
    key: '',
  })
);

export const webllmAtom = atom<{
  engine?: MLCEngine;
  fetchProgress: number;
  loadProgress: number;
  status: string;
}>({
  engine: undefined,
  fetchProgress: -1,
  loadProgress: -1,
  status: '',
});

export function useLitlytics() {
  const config = useAtomValue(configAtom);
  const webllm = useAtomValue(webllmAtom);
  const [litlytics, setLitlytics] = useAtom(litlyticsAtom);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // create proxy that triggers state updates
  // only create it once
  useEffect(() => {
    setLitlytics(
      createReactiveProxy(
        new LitLytics({
          provider: 'openai',
          model: 'gpt-4o-mini',
          key: '',
        }),
        () => forceUpdate()
      )
    );
  }, [setLitlytics]);

  // update config and engine on changes
  useEffect(() => {
    litlytics.importConfig(config);
    litlytics.setWebEngine(webllm.engine);
  }, [config, webllm, litlytics]);

  return litlytics;
}
