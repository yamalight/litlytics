import { LLMProviders } from '@/src/litlytics';
import { localModelSizes } from '@/src/llm/sizes';
import { LLMModelsList, LLMProvidersList } from '@/src/llm/types';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { MLCEngine } from '@mlc-ai/web-llm';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { litlyticsConfigStore, webllmAtom } from '~/store/store';
import { Button } from '../catalyst/button';
import { Description, Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';
import { Select } from '../catalyst/select';
import { Spinner } from '../Spinner';
import { Recommended, recommendedForProvider } from './Recommended';

export function Settings() {
  const [webllm, setWebllm] = useAtom(webllmAtom);
  const [config, setConfig] = useAtom(litlyticsConfigStore);
  const [providers, setProviders] = useState<LLMProviders[]>([]);

  const models = useMemo(() => LLMModelsList[config.provider], [config]);

  useEffect(() => {
    async function loadProviders() {
      const prov: LLMProviders[] = structuredClone(
        LLMProvidersList
      ) as unknown as LLMProviders[];
      try {
        if (!navigator.gpu) {
          setProviders(prov);
          return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          setProviders(prov);
          return;
        }

        const device = await adapter.requestDevice();
        if (!device) {
          setProviders(prov);
          return;
        }

        setProviders(['local', ...prov]);
      } catch (err) {
        console.error(err);
        setProviders(prov);
      }
    }
    loadProviders();
  }, []);

  const loadLocalModel = () => {
    // create engine
    const engine = new MLCEngine();
    engine.setInitProgressCallback((initProgress) => {
      const textProgress = initProgress.text.split('[').at(1)?.split(']').at(0);
      const isFetching = initProgress.text.includes('Fetching');
      const isFinished = initProgress.text.includes('Finish');
      const [leftProgress, rightProgress] = textProgress?.split('/') ?? [
        '0',
        '1',
      ];
      const loadProgress = parseInt(leftProgress) / parseInt(rightProgress);
      console.log({
        fetchProgress: isFetching ? initProgress.progress : 1,
        loadProgress,
        status: initProgress.text,
      });
      setWebllm({
        engine,
        fetchProgress: isFetching ? initProgress.progress : 1,
        loadProgress: isFinished ? 1 : loadProgress,
        status: initProgress.text,
      });
    });
    engine.reload(config.model);
    setWebllm({ engine, fetchProgress: 0, loadProgress: 0, status: '' });
  };

  return (
    <div className="max-w-full">
      <FieldGroup>
        <Field>
          <Label>Provider</Label>
          <div className="flex gap-2">
            <Select
              value={config.provider}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  provider: e.target.value as LLMProviders,
                  model: LLMModelsList[e.target.value as LLMProviders][0],
                  llmKey: '',
                }))
              }
            >
              {providers.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </Select>
            <Recommended />
          </div>
        </Field>

        <Field>
          <Label>Model</Label>
          <Select
            value={config.model}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                model: e.target.value,
              }))
            }
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}{' '}
                {recommendedForProvider[config.provider] === model
                  ? '(recommended)'
                  : ''}
              </option>
            ))}
          </Select>
        </Field>

        {config.provider !== 'local' && (
          <Field>
            <Label>API Key</Label>
            <Input
              type="password"
              value={config.llmKey}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  llmKey: e.target.value,
                }))
              }
            />
            {Boolean(config.llmKey?.length) && (
              <Description>
                Your key is stored only in your browser and passed directly to
                API provider.
              </Description>
            )}
          </Field>
        )}

        {config.provider === 'local' && (
          <Field className="flex flex-col">
            <div className="flex items-center gap-2">
              <Button
                onClick={loadLocalModel}
                title={webllm.status ?? ''}
                disabled={webllm.fetchProgress !== -1}
              >
                {webllm.fetchProgress > -1 && webllm.fetchProgress < 1 ? (
                  <>
                    <Spinner className="w-3 h-3" />
                    Fetching {Math.round(webllm.fetchProgress * 100)}%
                  </>
                ) : webllm.loadProgress > -1 && webllm.loadProgress < 1 ? (
                  <>
                    <Spinner className="w-3 h-3" />
                    Loading {Math.round(webllm.loadProgress * 100)}%
                  </>
                ) : webllm.loadProgress === 1 ? (
                  'Model loaded'
                ) : (
                  'Load model'
                )}
              </Button>
              <Description>
                Download and use selected model locally. This model size is:{' '}
                <strong>{localModelSizes[config.model]}mb</strong>
              </Description>
            </div>
          </Field>
        )}
      </FieldGroup>

      {!config.llmKey?.length && config.provider !== 'local' && (
        <div className="rounded-md bg-red-50 dark:bg-red-900 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                aria-hidden="true"
                className="h-5 w-5 text-red-400 dark:text-red-200"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Choose a provider, model and set a key for the provider of your
                choice to get started!
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
