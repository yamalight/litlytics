import { useAtom, useAtomValue } from 'jotai';
import { emptyPipeline, LitLytics, Pipeline, PipelineStatus } from 'litlytics';
import { createContext, useContext, useEffect } from 'react';
import {
  configAtom,
  litlyticsAtom,
  pipelineAtom,
  pipelineStatusAtom,
  webllmAtom,
} from './store';

const LitLyticsContext = createContext<{
  litlytics: LitLytics;
  pipeline: Pipeline;
  setPipeline: (p: Pipeline) => void;
  pipelineStatus: PipelineStatus;
  setPipelineStatus: (s: PipelineStatus) => void;
}>({
  litlytics: new LitLytics({
    provider: 'openai',
    model: 'gpt-4o-mini',
    key: '',
  }),
  pipeline: emptyPipeline,
  setPipeline: () => {},
  pipelineStatus: { status: 'init' } as PipelineStatus,
  setPipelineStatus: () => {},
});

export function WithLitLytics({ children }: { children: React.ReactNode }) {
  const webllm = useAtomValue(webllmAtom);
  const config = useAtomValue(configAtom);
  const litlytics = useAtomValue(litlyticsAtom);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [pipelineStatus, setPipelineStatus] = useAtom(pipelineStatusAtom);

  // update config / llm on changes
  useEffect(() => {
    // assign updated config
    const cfg = litlytics.exportConfig();
    if (
      cfg.provider !== config.provider ||
      cfg.model !== config.model ||
      cfg.llmKey !== config.llmKey
    ) {
      litlytics.importConfig(config);
    }
    // assign webllm engine
    if (litlytics.engine !== webllm.engine) {
      litlytics.engine = webllm.engine;
    }
  }, [config, webllm, litlytics]);

  // update pipeline on changes
  useEffect(() => {
    litlytics.setPipeline(pipeline);
  }, [pipeline, litlytics]);

  return (
    <LitLyticsContext.Provider
      value={{
        litlytics,
        pipeline,
        setPipeline,
        pipelineStatus,
        setPipelineStatus,
      }}
    >
      {children}
    </LitLyticsContext.Provider>
  );
}

export const useLitlytics = () => {
  const ctx = useContext(LitLyticsContext);
  return ctx;
};
