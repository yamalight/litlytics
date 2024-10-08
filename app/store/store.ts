import { atom } from 'jotai';
import { withUndo } from 'jotai-history';
import { atomWithStorage } from 'jotai/utils';
import {
  LitLytics,
  LLMModel,
  LLMProvider,
  MLCEngine,
  Pipeline,
  PipelineStatus,
} from 'litlytics';

export const emptyPipeline: Pipeline = {
  // project setup
  name: '',
  // pipeline plan
  pipelinePlan: '',
  pipelineDescription: '',
  // pipeline source
  source: {
    id: 'source_0',
    name: 'Source',
    description: 'Primary source',
    type: 'source',
    sourceType: 'text',
    config: {},
    connectsTo: [],
    expanded: true,
  },
  // pipeline output
  output: {
    id: 'output_0',
    name: 'Output',
    description: 'Primary output',
    type: 'output',
    outputType: 'basic',
    config: {},
    connectsTo: [],
    expanded: true,
  },
  // pipeline steps
  steps: [],
};

export const litlyticsConfigStore = atomWithStorage<{
  provider: LLMProvider | 'local';
  model: LLMModel;
  llmKey: string;
}>(
  'litltyics.config',
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    llmKey: '',
  },
  undefined,
  { getOnInit: true }
);
export const litlyticsStore = atom<LitLytics>(
  new LitLytics({
    provider: 'openai',
    model: 'gpt-4o-mini',
    key: '',
  })
);

export const pipelineStatusAtom = atom<PipelineStatus>({
  status: 'init',
});

export const pipelineAtom = atomWithStorage<Pipeline>(
  'litlytics.pipeline',
  emptyPipeline,
  undefined,
  { getOnInit: true }
);
export const pipelineUndoAtom = withUndo(pipelineAtom, 10);

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
