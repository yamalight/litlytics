import { atom } from 'jotai';
import { withUndo } from 'jotai-history';
import { atomWithStorage } from 'jotai/utils';
import {
  emptyPipeline,
  LitLytics,
  LitLyticsConfig,
  Pipeline,
  PipelineStatus,
} from 'litlytics';

// litlytics config, persisted in localStorage
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

// litlytics pipeline, persisted in localStorage
export const pipelineAtom = atomWithStorage<Pipeline>(
  'litlytics.pipeline',
  emptyPipeline,
  undefined,
  { getOnInit: true }
);
export const pipelineUndoAtom = withUndo(pipelineAtom, 10);

// pipeline status
export const pipelineStatusAtom = atom<PipelineStatus>({ status: 'init' });

// litlytics instance
export const litlyticsAtom = atom<LitLytics>(
  new LitLytics({
    provider: 'openai',
    model: 'gpt-4o-mini',
    key: '',
  })
);

// litlytics config, persisted in localStorage
export const uiLayoutAtom = atomWithStorage<'agent' | 'execution'>(
  'litlytics.uilayout',
  'agent',
  undefined,
  { getOnInit: true }
);
