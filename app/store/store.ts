import { atom } from 'jotai';
import { withUndo } from 'jotai-history';
import { atomWithStorage } from 'jotai/utils';
import { LitLytics, LitLyticsConfig, MLCEngine } from 'litlytics';

export const configAtom = atomWithStorage<LitLyticsConfig>(
  'litlytics.config',
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

export const litlyticsInitedAtom = atom(false);
